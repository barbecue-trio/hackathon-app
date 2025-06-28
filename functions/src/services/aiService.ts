import { GoogleGenAI, Modality } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiApiKey } from "../config";
import {
  MENU_EXTRACTION_PROMPT,
  createCategoryBatchPrompt,
  createCategoryIndividualPrompt,
  createFoodCulturePrompt,
} from "../prompts";
import type { GeneratedImage, MenuItem } from "../types";
import { extractMenuNamesFromText, fetchImageAsBase64 } from "./imageService";

const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";
const imageModelAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function extractMenuWithGoogleAI(
  gcsUri: string
): Promise<{ name: string; name_jp: string }[]> {
  try {
    const apiKey = geminiApiKey;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const imageData = await fetchImageAsBase64(gcsUri);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      MENU_EXTRACTION_PROMPT,
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

    console.log("抽出されたJSON文字列:", jsonString);

    try {
      const menuData = JSON.parse(jsonString);
      console.log("パースされたメニューデータ:", menuData);

      if (Array.isArray(menuData)) {
        const processedData = menuData
          .map((item) => {
            if (typeof item === "string") {
              // 文字列の場合は、英語名を生成する
              console.log(`文字列アイテム: ${item}`);
              return { name: item, name_jp: item };
            }
            if (
              item &&
              typeof item === "object" &&
              "name" in item &&
              "name_jp" in item
            ) {
              console.log(`オブジェクトアイテム: ${JSON.stringify(item)}`);
              return { name: item.name, name_jp: item.name_jp };
            }
            console.log(`無効なアイテム: ${JSON.stringify(item)}`);
            return { name: "", name_jp: "" };
          })
          .filter((item) => item.name && item.name_jp);

        console.log("処理後のメニューデータ:", processedData);

        // 文字列配列が返された場合は、日本語名をそのまま英語名として使用
        if (
          processedData.length > 0 &&
          processedData[0].name === processedData[0].name_jp
        ) {
          console.log(
            "文字列配列が検出されました。日本語名をそのまま使用します..."
          );
          return processedData.map((item) => ({
            name: item.name_jp, // 日本語名をそのまま英語名として使用
            name_jp: item.name_jp,
          }));
        }

        return processedData;
      }
      return [];
    } catch (parseError) {
      console.error("JSON解析エラー:", parseError);
      console.log("フォールバック: テキストからメニュー名を抽出");
      const menuNames = extractMenuNamesFromText(text);
      const fallbackData = menuNames.map((item) => ({
        name: item.name_jp,
        name_jp: item.name_jp,
      }));
      console.log("フォールバックデータ:", fallbackData);

      // フォールバックでも英語名を生成する
      if (fallbackData.length > 0) {
        console.log("フォールバックデータをそのまま使用します...");
        return fallbackData.map((item) => ({
          name: item.name_jp, // 日本語名をそのまま英語名として使用
          name_jp: item.name_jp,
        }));
      }

      return fallbackData;
    }
  } catch (error) {
    console.error("Google AIでの抽出エラー:", error);
    throw error;
  }
}

export async function generateFoodCultureWithAI(
  menuName: string
): Promise<string> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1秒

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = geminiApiKey;
      if (!apiKey) {
        throw new Error("Gemini API key not configured");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = createFoodCulturePrompt(menuName);

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleanedText = text.trim().replace(/\n+/g, " ").replace(/\s+/g, " ");

      return cleanedText;
    } catch (error) {
      console.error(
        `"${menuName}"の食文化生成でエラー (試行 ${attempt}/${maxRetries}):`,
        error
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      console.error(
        `"${menuName}"の食文化生成が${maxRetries}回試行しても失敗しました`
      );
      return "Failed to generate food culture information.";
    }
  }

  return "Failed to generate food culture information.";
}

// 全メニューのカテゴリーを一括で判定する関数
export async function determineCategoriesForAllMenus(
  menus: MenuItem[]
): Promise<number[]> {
  try {
    const apiKey = geminiApiKey;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // メニューリストを作成
    const menuList = menus
      .map((menu, index) => `${index + 1}. ${menu.name} (${menu.name_jp})`)
      .join("\n");

    const prompt = createCategoryBatchPrompt(menuList);

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log("AIの回答:", text);

    // JSON配列を抽出
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const categoryIds = JSON.parse(jsonMatch[0]);
        if (Array.isArray(categoryIds) && categoryIds.length === menus.length) {
          // 各IDが1-5の範囲内かチェック
          const validIds = categoryIds.map((id) => {
            const numId = Number.parseInt(id);
            return numId >= 1 && numId <= 5 ? numId : 5;
          });
          return validIds;
        }
      } catch (parseError) {
        console.error("JSON解析エラー:", parseError);
      }
    }

    // AIの回答が不正な場合は、個別に判定
    console.warn(
      `AIの一括回答が不正でした: "${text}"。個別判定にフォールバックします。`
    );
    return await determineCategoriesIndividually(menus);
  } catch (error) {
    console.error("一括カテゴリー判定でエラーが発生しました:", error);
    // エラーの場合は個別判定にフォールバック
    return await determineCategoriesIndividually(menus);
  }
}

// 個別判定のフォールバック関数
async function determineCategoriesIndividually(
  menus: MenuItem[]
): Promise<number[]> {
  console.log("個別判定でカテゴリーを判定中...");
  const results: number[] = [];

  for (let i = 0; i < menus.length; i++) {
    try {
      const categoryId = await determineCategoryFromMenuName(
        menus[i].name,
        menus[i].name_jp
      );
      results.push(categoryId);
    } catch (error) {
      console.error(`個別判定でエラー: ${menus[i].name}`, error);
      results.push(5); // デフォルト値
    }

    // リクエスト間に少し待機時間を設ける
    if (i < menus.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

// メニュー名からカテゴリーIDを判定する関数
async function determineCategoryFromMenuName(
  name: string,
  nameJp: string
): Promise<number> {
  try {
    const apiKey = geminiApiKey;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = createCategoryIndividualPrompt(name, nameJp);

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const numberMatch = text.match(/\d+/);
    if (numberMatch) {
      const categoryId = Number.parseInt(numberMatch[0]);
      if (categoryId >= 1 && categoryId <= 5) {
        return categoryId;
      }
    }

    console.warn(
      `AIの回答が不正でした: "${text}"。デフォルト値5を使用します。`
    );
    return 5;
  } catch (error) {
    console.error(`カテゴリー判定でエラーが発生しました: ${name}`, error);
    // エラーの場合はデフォルトで5（その他）を返す
    return 5;
  }
}

// メニュー名から画像を生成する関数
export async function generateMenuImage(
  menuName: string
): Promise<GeneratedImage | null> {
  const prompt = `
料理名：${menuName}の画像を生成してください。
生成する際には以下の条件に従ってください。

## 条件
- 画像のスタイル: 写実的で食品サンプルやディスプレイ用の料理写真
- 画像のテーマ: ${menuName}の料理が主役となるように、他の要素は一切含めない
- 画像の背景: シンプルで料理が引き立つように、背景は白または淡い色にしてください
- 画像の構図: 料理が中央に配置され、全体がよく見えるように、クローズアップで、余計なものが写り込まないようにしてください
- **文字、ロゴ、ブランド名、日付、透かし、その他のテキストは一切含めないでください。**
- **人間、手、食器の一部（料理を盛る皿以外）、その他の物体は含めないでください。**
- [ID: ${Date.now()}]
`;

  return await generateImage(prompt);
}

// 画像生成のためのGemini APIを使用する関数
async function generateImage(prompt: string): Promise<GeneratedImage | null> {
  const MAX_RETRIES = 5;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await imageModelAI.models.generateContent({
        model: IMAGE_MODEL,
        contents: prompt,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
      });
      if (
        !res ||
        !res.candidates ||
        res.candidates.length === 0 ||
        !res.candidates[0].content ||
        !res.candidates[0].content.parts
      ) {
        throw new Error("No candidates returned from Gemini API");
      }
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (!imageData) {
            throw new Error("No image data found in the inline data");
          }
          const mimeType = part.inlineData.mimeType;
          if (!mimeType) {
            throw new Error("No mimeType found in the inline data");
          }
          return { base64: imageData, mimeType: mimeType };
        }
      }
      throw new Error("No image data found in any part");
    } catch (err) {
      console.warn("Gemini API error", err);
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }
  return null;
}
