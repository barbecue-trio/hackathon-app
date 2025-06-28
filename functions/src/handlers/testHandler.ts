import type { Request } from "firebase-functions/v2/https"
import { bucket } from "../config"
import { extractMenuWithGoogleAI } from "../services/aiService"
import { saveMenuData } from "../services/firestoreService"
import type { MenuCollection, ProcessImageResponse } from "../types"
import { generateCategoriesForDocument } from "./categoryHandler"
import { generateFoodCultureForDocument } from "./foodCultureHandler"

export async function handleTestProcessMenuImage(request: Request, response: any): Promise<void> {
  try {
    // GETリクエストでテスト用の固定画像を使用
    if (request.method !== "GET") {
      response.status(405).json({
        success: false,
        error: "Method not allowed. Use GET for testing.",
      })
      return
    }

    const testStorageId = "menuImages/testMenu.webp"

    // storageIdにmenuImages/プレフィックスが含まれていない場合は追加
    const fullStorageId = testStorageId.startsWith("menuImages/")
      ? testStorageId
      : `menuImages/${testStorageId}`
    const gcsUri = `gs://${bucket.value()}/${fullStorageId}`

    // Google AIでメニュー情報を抽出
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
        category_id: "",
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
    console.error("テストエラーが発生しました:", error)
    response.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}
