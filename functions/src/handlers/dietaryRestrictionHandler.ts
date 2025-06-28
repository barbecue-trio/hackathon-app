import type { Request } from "firebase-functions/v2/https"
import {
  checkAllergen,
  checkReligiousRestriction,
  generateIngredients,
} from "../services/aiService"

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

    const ingredients = await generateIngredients("豚の角煮")
    console.log("Generated ingredients:", ingredients)
    const allergens = await checkAllergen(ingredients, [3, 27])
    const religiousRestrictions = await checkReligiousRestriction(ingredients, [1])

    response.status(200).json({
      success: true,
      message: "食事制限チェックが完了しました",
      data: {
        documentId: documentId,
        ingredients: ingredients,
        allergens: allergens,
        religiousRestrictions: religiousRestrictions,
      },
    })

    // response.sendStatus(200)
  } catch (error) {
    console.error("食事制限チェックでエラーが発生しました:", error)
    response.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}
