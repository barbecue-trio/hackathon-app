import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { defineString } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

// 環境変数の定義
const geminiApiKey = defineString("GEMINI_API_KEY");
const bucket = defineString("BUCKET");

// 型定義
interface MenuItem {
  name: string;
  image_id: string;
  ingredients: string[];
  allergy_ids: string[];
  dietary_restriction_ids: string[];
  category_id: string;
}

interface MenuCollection {
  menus: MenuItem[];
}

interface ProcessImageRequest {
  storageId: string;
}

interface ProcessImageResponse {
  success: boolean;
  documentId?: string;
  error?: string;
  menuCount?: number;
}

admin.initializeApp();

const db = getFirestore("barbecue");

export const processMenuImage = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  async (request, response) => {
    try {
      // POSTリクエストのみ許可
      if (request.method !== "POST") {
        response.status(405).json({
          success: false,
          error: "Method not allowed. Use POST.",
        });
        return;
      }

      const { storageId }: ProcessImageRequest = request.body;

      if (!storageId) {
        response.status(400).json({
          success: false,
          error: "storageId is required",
        });
        return;
      }

      console.log("ストレージIDが受け取られました:", storageId);
      const gcsUri = `gs://${bucket.value()}/${storageId}`;

      // Google AIでメニュー情報を抽出
      const menuNames = await extractMenuWithGoogleAI(gcsUri);
      console.log("抽出されたメニュー名:", menuNames);

      if (menuNames.length === 0) {
        response.status(400).json({
          success: false,
          error: "メニュー名が抽出できませんでした",
        });
        return;
      }

      // 新しいデータ構造でメニュー情報を作成
      const menuCollection: MenuCollection = {
        menus: menuNames.map((menuName) => ({
          name: menuName,
          image_id: "",
          ingredients: [],
          allergy_ids: [],
          dietary_restriction_ids: [],
          category_id: "",
        })),
      };

      console.log("保存用メニューコレクション:", menuCollection);

      // Firestoreにメニュー情報を保存
      const documentId = await saveMenuData(storageId, menuCollection);

      console.log(
        "メニュー情報の保存が完了しました。ドキュメントID:",
        documentId
      );

      // 成功レスポンス
      const responseData: ProcessImageResponse = {
        success: true,
        documentId: documentId,
        menuCount: menuNames.length,
      };

      response.status(200).json(responseData);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      response.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

async function extractMenuWithGoogleAI(gcsUri: string): Promise<string[]> {
  try {
    const apiKey = geminiApiKey.value();
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const imageData = await fetchImageAsBase64(gcsUri);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
この画像は居酒屋のメニューです。以下の条件でメニュー名のみを抽出してください：
条件：
1. メニュー名のみを抽出（価格は除外）
2. カテゴリ名（「とりあえず」「おすすめメニュー」「揚げもの」「刺身」「焼きもの」など）は除外
3. 価格のみの行は除外
4. 複合メニューは必ず個別のメニューに分割
   - 「おにぎり 梅・シャケ・高菜」→「梅おにぎり」「シャケおにぎり」「高菜おにぎり」
   - 「刺身盛り合わせ マグロ・サーモン・ブリ」→「マグロ刺身」「サーモン刺身」「ブリ刺身」
   - 「焼き鳥 もも・ねぎま・つくね」→「もも焼き鳥」「ねぎま焼き鳥」「つくね焼き鳥」
5. メニュー名は具体的で分かりやすく
6. 重複は除外
7. 食材の種類が明確な場合は、その食材名を含める

以下の形式でJSON配列で返してください：
["メニュー名1", "メニュー名2", "メニュー名3", ...]
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
    ]);

    const text = result.response.text();
    console.log("Google AIの応答:", text);

    const jsonMatch =
      text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

    try {
      const menuNames = JSON.parse(jsonString);
      return Array.isArray(menuNames) ? menuNames : [];
    } catch (parseError) {
      console.error("JSON解析エラー:", parseError);
      return extractMenuNamesFromText(text);
    }
  } catch (error) {
    console.error("Google AIでの抽出エラー:", error);
    throw error;
  }
}

async function fetchImageAsBase64(gcsUri: string): Promise<string> {
  try {
    const match = gcsUri.match(/gs:\/\/([^\/]+)\/(.+)/);
    if (!match) {
      throw new Error("Invalid GCS URI");
    }
    const bucketName = match[1];
    const fileName = match[2];

    // Firebase Admin SDKを使用してGCSからファイルを取得
    const bucket = admin.storage().bucket(bucketName);
    const file = bucket.file(fileName);
    const [buffer] = await file.download();

    return buffer.toString("base64");
  } catch (error) {
    console.error("画像取得エラー:", error);
    throw error;
  }
}

function extractMenuNamesFromText(text: string): string[] {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const menuNames: string[] = [];

  const priceOnlyPatterns = [
    /^\d+$/,
    /^\$\d+$/,
    /^\d+円$/,
    /^\d+\.$/,
    /^\d+\s*円$/,
    /^\d+\s*-\s*\d+$/,
    /^\d+\s*〜\s*\d+$/,
  ];

  const excludePatterns = [
    /^[0-9\s\.\$円\-〜]+$/,
    /^[0-9]+$/,
    /^[0-9]+\.$/,
    /^[0-9]+\s*円$/,
    /^\$[0-9]+$/,
    /^[0-9]+\s*[0-9]+$/,
    /^[0-9]+\s*-\s*[0-9]+$/,
    /^[0-9]+\s*〜\s*[0-9]+$/,
  ];

  const categoryKeywords = [
    "とりあえず",
    "おすすめ",
    "おすすめメニュー",
    "揚げもの",
    "刺身",
    "焼きもの",
    "サラダ",
    "ご飯もの",
    "麺類",
    "飲み物",
    "アルコール",
    "ソフトドリンク",
    "デザート",
    "サイドメニュー",
    "セット",
    "単品",
    "小鉢",
    "一品料理",
    "メイン",
    "サイド",
    "前菜",
    "メニュー",
    "カテゴリー",
    "分類",
    "種類",
  ];

  for (const line of lines) {
    if (!line || line.trim().length === 0) continue;
    if (priceOnlyPatterns.some((pattern) => pattern.test(line))) continue;
    if (excludePatterns.some((pattern) => pattern.test(line))) continue;
    if (categoryKeywords.some((keyword) => line.includes(keyword))) continue;

    let menuName = line;
    menuName = menuName.replace(/\s*\d+円?\s*$/, "");
    menuName = menuName.replace(/^\s*\d+円?\s*/, "");
    menuName = menuName.replace(/\s*\$\d+\s*/, "");
    menuName = menuName.replace(/\s*\d+\.\d+\s*/, "");

    const subMenus = menuName
      .split(/[・、,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    for (const subMenu of subMenus) {
      if (isValidMenuName(subMenu)) {
        menuNames.push(subMenu);
      }
    }
  }

  return [...new Set(menuNames)];
}

function isValidMenuName(name: string): boolean {
  if (!name || name.length < 2) return false;
  if (/^[0-9\s\.\$円\-〜]+$/.test(name)) return false;
  const categoryKeywords = [
    "とりあえず",
    "おすすめ",
    "揚げもの",
    "刺身",
    "焼きもの",
    "サラダ",
    "ご飯もの",
    "麺類",
    "飲み物",
    "アルコール",
    "ソフトドリンク",
    "デザート",
    "サイドメニュー",
    "セット",
    "単品",
    "小鉢",
    "一品料理",
    "メイン",
    "サイド",
    "前菜",
    "メニュー",
    "カテゴリー",
    "分類",
    "種類",
  ];
  if (categoryKeywords.some((keyword) => name.includes(keyword))) return false;
  return true;
}

async function saveMenuData(imageId: string, menuCollection: MenuCollection) {
  try {
    const docRef = db.collection("menu_collections").doc();
    await docRef.set({
      ...menuCollection,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`${menuCollection.menus.length}個のメニューを保存しました`);
    console.log("ドキュメントID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Firestore保存エラー:", error);
    throw error;
  }
}
