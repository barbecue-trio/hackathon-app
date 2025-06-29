import type { Request } from "firebase-functions/v2/https"
import { bucket } from "../config"
import { extractMenuWithGoogleAI } from "../services/aiService"
import { saveMenuData } from "../services/firestoreService"
import type { MenuCollection, ProcessImageRequest, ProcessImageResponse } from "../types"
import { generateCategoriesForDocument } from "./categoryHandler"
import { generateFoodCultureForDocument } from "./foodCultureHandler"

export async function handleProcessMenuImage(request: Request, response: any): Promise<void> {
  try {
    if (request.method !== "POST") {
      response.status(405).json({
        success: false,
        error: "Method not allowed. Use POST.",
      })
      return
    }

    const { storageId }: ProcessImageRequest = request.body

    if (!storageId) {
      response.status(400).json({
        success: false,
        error: "storageId is required",
      })
      return
    }

    console.log("ストレージIDが受け取られました:", storageId)

    const fullStorageId = storageId.startsWith("menuImages/")
      ? storageId
      : `menuImages/${storageId}`
    const gcsUri = `gs://${bucket}/${fullStorageId}`

    const menuNames = await extractMenuWithGoogleAI(gcsUri)

    if (menuNames.length === 0) {
      response.status(400).json({
        success: false,
        error: "メニュー名が抽出できませんでした",
      })
      return
    }

    // 新しいデータ構造でメニュー情報を作成
    const menuCollection: MenuCollection = {
      menus: menuNames.map((menuName) => ({
        name: menuName.name,
        name_jp: menuName.name_jp,
        image_id: "",
        ingredients: [],
        allergy_ids: [],
        dietary_restriction_ids: [],
        category_id: 5, // デフォルト値：その他
        food_culture: "",
      })),
    }

    const documentId = await saveMenuData(menuCollection)

    await generateCategoriesForDocument(documentId).catch((error: unknown) => {
      console.error("カテゴリー生成処理でエラーが発生しました:", error)
    })

    generateFoodCultureForDocument(documentId).catch((error: unknown) => {
      console.error("食文化生成処理でエラーが発生しました:", error)
    })

    // 成功レスポンス
    const responseData: ProcessImageResponse = {
      success: true,
      documentId: documentId,
      menuCount: menuNames.length,
    }

    response.status(200).json(responseData)
  } catch (error) {
    console.error("エラーが発生しました:", error)
    response.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}
