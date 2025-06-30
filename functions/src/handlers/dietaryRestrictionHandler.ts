import type { Request } from "firebase-functions/v2/https"
import type { MenuCollection } from "src/types"
import {
  checkAllergen,
  checkReligiousRestriction,
  generateIngredients,
} from "../services/aiService"
import { getMenuCollection, updateMenuCollection } from "../services/firestoreService"

export async function handleCheckDietaryRestrictions(
  request: Request,
  response: any
): Promise<void> {
  try {
    // POSTリクエストのみ許可
    if (request.method !== "POST") {
      response.status(405).json({
        success: false,
        error: "Method not allowed. Use POST.",
      })
      return
    }

    const documentId = request.query.documentId as string | undefined

    if (!documentId) {
      response.status(400).json({
        success: false,
        error: "documentId is required",
      })
      return
    }

    const menuCollection = await getMenuCollection(documentId)
    if (!menuCollection || !menuCollection.menus) {
      response.status(404).json({ error: "No menus found in the document" })
      return
    }
    const menus = menuCollection.menus
    const updatedMenus = await Promise.all(
      menus.map(async (menu) => {
        const ingredients = await generateIngredients(menu.name)
        const allergenIds = await checkAllergen(ingredients)
        const religiousRestrictionIds = await checkReligiousRestriction(ingredients)
        return {
          ...menu,
          dietary_restriction_ids: religiousRestrictionIds,
          allergy_ids: allergenIds,
          ingredients: ingredients,
        }
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
    console.error("食事制限チェックでエラーが発生しました:", error)
    response.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}
