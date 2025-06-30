import type { Request } from "firebase-functions/v2/https"
import { generateMenuImage } from "../services/aiService"
import { uploadMenuImage } from "../services/cloudStorageService"
import { getMenuCollection, updateMenuCollection } from "../services/firestoreService"
import type { MenuCollection } from "../types"

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

    response.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({ success: false, error: "Internal Server Error" })
  }
}
