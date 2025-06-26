"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMenuImage = void 0;
const storage_1 = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const generative_ai_1 = require("@google/generative-ai");
const firestore_1 = require("firebase-admin/firestore");
// Firebase Admin SDKの初期化
admin.initializeApp();
// データベースIDを指定してFirestoreインスタンスを取得
const db = (0, firestore_1.getFirestore)("barbecue");
// Firebase Storageに画像がアップロードされた際のトリガー関数
exports.processMenuImage = (0, storage_1.onObjectFinalized)({
    bucket: "barbecue-trio.firebasestorage.app",
    region: "asia-northeast1",
    memory: "512MiB",
}, async (event) => {
    try {
        const bucketName = event.data.bucket;
        const fileName = event.data.name;
        if (!fileName) {
            console.log("ファイル名が取得できませんでした");
            return;
        }
        console.log("画像がアップロードされました:", fileName);
        const gcsUri = `gs://${bucketName}/${fileName}`;
        // Google AIでメニュー情報を抽出
        const menuNames = await extractMenuWithGoogleAI(gcsUri);
        console.log("抽出されたメニュー名:", menuNames);
        // テスト用のダミーデータ（フォールバック用）
        // const menuNames = [
        //   "テストメニュー1",
        //   "テストメニュー2",
        //   "テストメニュー3",
        // ];
        // console.log("テスト用メニュー名:", menuNames);
        if (menuNames.length === 0) {
            console.log("メニュー名が抽出できませんでした");
            return;
        }
        // 新しいデータ構造でメニュー情報を作成
        const menuCollection = {
            menus: menuNames.map((menuName) => ({
                name: menuName,
                image_id: fileName,
                ingredients: [],
                allergy_ids: [],
                dietary_restriction_ids: [],
                category_id: fileName, // 画像IDをカテゴリIDとして使用
            })),
        };
        console.log("保存用メニューコレクション:", menuCollection);
        // Firestoreにメニュー情報を保存
        await saveMenuData(fileName, menuCollection);
        console.log("メニュー情報の保存が完了しました");
    }
    catch (error) {
        console.error("エラーが発生しました:", error);
        throw error;
    }
});
// Google AIで画像からメニュー名を抽出する関数
async function extractMenuWithGoogleAI(gcsUri) {
    try {
        // Google AI SDKの初期化
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key not configured");
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        // 画像をBase64エンコードで取得
        const imageData = await fetchImageAsBase64(gcsUri);
        // モデルの初期化
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
        // 画像をGoogle AIに渡す
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
        // JSONを抽出（```json で囲まれている場合がある）
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
        try {
            const menuNames = JSON.parse(jsonString);
            return Array.isArray(menuNames) ? menuNames : [];
        }
        catch (parseError) {
            console.error("JSON解析エラー:", parseError);
            // フォールバック：テキストから手動で抽出
            return extractMenuNamesFromText(text);
        }
    }
    catch (error) {
        console.error("Google AIでの抽出エラー:", error);
        throw error;
    }
}
// GCSから画像をBase64エンコードで取得する関数
async function fetchImageAsBase64(gcsUri) {
    try {
        // GCS URIからバケット名とファイル名を抽出
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
    }
    catch (error) {
        console.error("画像取得エラー:", error);
        throw error;
    }
}
// テキストからメニュー名を抽出する関数（フォールバック用）
function extractMenuNamesFromText(text) {
    if (!text)
        return [];
    // テキストを行に分割
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    const menuNames = [];
    // 価格のみのパターン
    const priceOnlyPatterns = [
        /^\d+$/,
        /^\$\d+$/,
        /^\d+円$/,
        /^\d+\.$/,
        /^\d+\s*円$/,
        /^\d+\s*-\s*\d+$/,
        /^\d+\s*〜\s*\d+$/, // 数字〜数字（価格範囲）
    ];
    // 除外すべきパターン
    const excludePatterns = [
        /^[0-9\s\.\$円\-〜]+$/,
        /^[0-9]+$/,
        /^[0-9]+\.$/,
        /^[0-9]+\s*円$/,
        /^\$[0-9]+$/,
        /^[0-9]+\s*[0-9]+$/,
        /^[0-9]+\s*-\s*[0-9]+$/,
        /^[0-9]+\s*〜\s*[0-9]+$/, // 数字〜数字
    ];
    // カテゴリーキーワード（これらは除外）
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
        // 空行をスキップ
        if (!line || line.trim().length === 0)
            continue;
        // 価格のみの行をスキップ
        if (priceOnlyPatterns.some((pattern) => pattern.test(line))) {
            continue;
        }
        // 除外パターンにマッチする行をスキップ
        if (excludePatterns.some((pattern) => pattern.test(line))) {
            continue;
        }
        // カテゴリーキーワードを含む行をスキップ
        if (categoryKeywords.some((keyword) => line.includes(keyword))) {
            continue;
        }
        // 価格が含まれている場合は価格部分を除去
        let menuName = line;
        // 価格パターンを除去
        menuName = menuName.replace(/\s*\d+円?\s*$/, ""); // 末尾の価格
        menuName = menuName.replace(/^\s*\d+円?\s*/, ""); // 先頭の価格
        menuName = menuName.replace(/\s*\$\d+\s*/, ""); // $価格
        menuName = menuName.replace(/\s*\d+\.\d+\s*/, ""); // 小数点価格
        // 複合メニューを分割
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
    // 重複を除去
    return [...new Set(menuNames)];
}
// メニュー名が有効かどうかをチェックする関数
function isValidMenuName(name) {
    if (!name || name.length < 2)
        return false;
    // 数字のみ、記号のみは除外
    if (/^[0-9\s\.\$円\-〜]+$/.test(name))
        return false;
    // カテゴリーキーワードは除外
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
    if (categoryKeywords.some((keyword) => name.includes(keyword)))
        return false;
    return true;
}
// Firestoreにメニューデータを保存する関数
async function saveMenuData(imageId, menuCollection) {
    try {
        // menu_collectionsコレクションにドキュメントを作成
        const docRef = db.collection("menu_collections").doc();
        // データを保存
        await docRef.set(Object.assign(Object.assign({}, menuCollection), { created_at: admin.firestore.FieldValue.serverTimestamp(), updated_at: admin.firestore.FieldValue.serverTimestamp() }));
        console.log(`${menuCollection.menus.length}個のメニューを保存しました`);
        console.log("ドキュメントID:", docRef.id);
    }
    catch (error) {
        console.error("Firestore保存エラー:", error);
        throw error;
    }
}
//# sourceMappingURL=index.js.map