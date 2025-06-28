import type { Request } from "firebase-functions/v2/https"
import { bucket } from "../config"
import { extractMenuWithGoogleAI, generateMenuImage } from "../services/aiService"
import { uploadMenuImage } from "../services/cloudStorageService"
import { getMenuCollection, saveMenuData, updateMenuCollection } from "../services/firestoreService"
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
    console.error("エラーが発生しました:", error)
    response.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

export async function handleGenerateMenuImage(request: Request, response: any): Promise<void> {
  if (request.method !== "POST") {
    response.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    })
    return
  }

  const documentId = request.query.documentId as string | undefined

  if (!documentId) {
    response.status(400).json({ error: "documentId are required" })
    return
  }

  try {
    const menuCollection = await getMenuCollection(documentId)
    if (!menuCollection || !menuCollection.menus) {
      response.status(404).json({ error: "No menus found in the document" })
      return
    }
    const menus = menuCollection.menus
    const updatedMenus = await Promise.all(
      menus.map(async (menu) => {
        const imageData = await generateMenuImage(menu.name)
        // 画像生成に失敗した場合はファイル名は空文字列を返す
        const fileName = imageData ? await uploadMenuImage(menu.name, imageData) : ""
        return { ...menu, image_id: fileName }
      })
    )
    const updatedMenuCollection: MenuCollection = {
      menus: updatedMenus,
    }
    await updateMenuCollection(documentId, updatedMenuCollection)

    response.sendStatus(200)
  } catch (error) {
    console.error(error)
    response.status(500).json({ success: false, error: "Internal Server Error" })
  }
}
