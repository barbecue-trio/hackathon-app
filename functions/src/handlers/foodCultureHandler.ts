import { Request } from "firebase-functions/v2/https";
import {
  GenerateFoodCultureRequest,
  GenerateFoodCultureResponse,
} from "../types";
import {
  getMenuCollection,
  updateMenuCollection,
} from "../services/firestoreService";
import { generateFoodCultureWithAI } from "../services/aiService";

export async function handleGenerateFoodCulture(
  request: Request,
  response: any
): Promise<void> {
  try {
    // POSTリクエストのみ許可
    if (request.method !== "POST") {
      response.status(405).json({
        success: false,
        error: "Method not allowed. Use POST.",
      });
      return;
    }

    const { documentId }: GenerateFoodCultureRequest = request.body;

    if (!documentId) {
      response.status(400).json({
        success: false,
        error: "documentId is required",
      });
      return;
    }

    // 食文化生成処理を実行
    const processedCount = await generateFoodCultureForDocument(documentId);

    const responseData: GenerateFoodCultureResponse = {
      success: true,
      processedCount: processedCount,
    };

    response.status(200).json(responseData);
  } catch (error) {
    console.error("食文化生成エラーが発生しました:", error);
    response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

// 食文化生成のメイン関数
export async function generateFoodCultureForDocument(
  documentId: string
): Promise<number> {
  try {
    const menuCollection = await getMenuCollection(documentId);

    const batchSize = 10; // 一度に処理するメニュー数
    const delayBetweenBatches = 1000; // バッチ間の待機時間（ミリ秒）
    const delayBetweenRequests = 500; // リクエスト間の待機時間（ミリ秒）

    const results: { index: number; foodCulture: string }[] = [];

    for (let i = 0; i < menuCollection.menus.length; i += batchSize) {
      const batch = menuCollection.menus.slice(i, i + batchSize);
      console.log(
        `バッチ ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          menuCollection.menus.length / batchSize
        )} を処理中...`
      );

      // バッチ内で並列処理
      const batchPromises = batch.map(async (menu, batchIndex) => {
        const globalIndex = i + batchIndex;
        try {
          console.log(
            `メニュー ${globalIndex + 1}/${menuCollection.menus.length}: ${
              menu.name
            } の食文化を生成中...`
          );

          // リクエスト間に少し待機時間を設ける
          if (batchIndex > 0) {
            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenRequests)
            );
          }

          const foodCulture = await generateFoodCultureWithAI(menu.name);
          return { index: globalIndex, foodCulture };
        } catch (error) {
          console.error(`メニュー ${menu.name} の食文化生成でエラー:`, error);
          return {
            index: globalIndex,
            foodCulture: "食文化情報の生成に失敗しました。",
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      if (i + batchSize < menuCollection.menus.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenBatches)
        );
      }
    }

    const updatedMenus = [...menuCollection.menus];
    for (const { index, foodCulture } of results) {
      updatedMenus[index].food_culture = foodCulture;
    }

    // Firestoreを更新
    await updateMenuCollection(documentId, { menus: updatedMenus });

    return results.length;
  } catch (error) {
    console.error("食文化生成処理でエラーが発生しました:", error);
    throw error;
  }
}
