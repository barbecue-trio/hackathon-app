import type { GenerateFoodCultureRequest, GenerateFoodCultureResponse } from "../types"
import type { Request } from "firebase-functions/v2/https"
import { determineCategoriesForAllMenus } from "../services/aiService"
import { getMenuCollection, updateMenuCollection } from "../services/firestoreService"

export async function handleGenerateCategories(request: Request, response: any): Promise<void> {
  try {
    // POSTリクエストのみ許可
    if (request.method !== "POST") {
      response.status(405).json({
        success: false,
        error: "Method not allowed. Use POST.",
      })
      return
    }

    const { documentId }: GenerateFoodCultureRequest = request.body

    if (!documentId) {
      response.status(400).json({
        success: false,
        error: "documentId is required",
      })
      return
    }

    // カテゴリー生成処理を実行
    const processedCount = await generateCategoriesForDocument(documentId)

    const responseData: GenerateFoodCultureResponse = {
      success: true,
      processedCount: processedCount,
    }

    response.status(200).json(responseData)
  } catch (error) {
    console.error("カテゴリー生成エラーが発生しました:", error)
    response.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

// カテゴリー生成のメイン関数
export async function generateCategoriesForDocument(documentId: string): Promise<number> {
  try {
    const menuCollection = await getMenuCollection(documentId)

    console.log(`${menuCollection.menus.length}個のメニューのカテゴリーを一括でAI判定中...`)

    // 全メニューをまとめてAIに投げてカテゴリー判定
    const categoryResults = await determineCategoriesForAllMenus(menuCollection.menus)

    const updatedMenus = [...menuCollection.menus]
    for (let i = 0; i < updatedMenus.length; i++) {
      updatedMenus[i].category_id = categoryResults[i] as 1 | 2 | 3 | 4 | 5
    }

    // Firestoreを更新
    await updateMenuCollection(documentId, { menus: updatedMenus })

    return updatedMenus.length
  } catch (error) {
    console.error("カテゴリー生成処理でエラーが発生しました:", error)
    throw error
  }
}
