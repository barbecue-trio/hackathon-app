import type { Request } from "firebase-functions/v2/https"
import { bucket } from "../config"
import { extractMenuWithGoogleAI } from "../services/aiService"
import { saveMenuData } from "../services/firestoreService"
import type { MenuCollection, ProcessImageRequest, ProcessImageResponse } from "../types"

// エンドポイントURL
const ENDPOINTS = {
  processMenuImage: "https://processmenuimage-oafytzg6qq-an.a.run.app",
  generateFoodCulture: "https://generatefoodculture-oafytzg6qq-an.a.run.app",
  generateCategories: "https://generatecategories-oafytzg6qq-an.a.run.app",
  generateMenuImage: "https://generatemenuimage-oafytzg6qq-an.a.run.app",
  checkDietaryRestrictions: "https://checkdietaryrestrictions-oafytzg6qq-an.a.run.app",
}

// エンドポイント呼び出し用のヘルパー関数
async function callEndpoint(
  url: string,
  body: any,
  method = "POST",
  queryParams?: Record<string, string>
): Promise<any> {
  try {
    let fullUrl = url
    if (queryParams) {
      const params = new URLSearchParams(queryParams)
      fullUrl = `${url}?${params.toString()}`
    }

    console.log(`エンドポイント呼び出し開始: ${fullUrl}`)
    const startTime = Date.now()

    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`エンドポイント呼び出し完了: ${fullUrl} (${duration}ms)`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`エンドポイント呼び出しエラー (${url}):`, error)
    throw error
  }
}

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
    console.log("メニューデータが保存されました。documentId:", documentId)

    // エンドポイント呼び出しを非同期で実行（レスポンスを待たない）
    processEndpointsAsync(documentId).catch((error) => {
      console.error("非同期エンドポイント処理でエラーが発生しました:", error)
    })

    // 成功レスポンス（documentIdを即座に返す）
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

// 非同期でエンドポイントを順次処理する関数
async function processEndpointsAsync(documentId: string): Promise<void> {
  console.log("非同期エンドポイント処理を開始...")
  try {
    await processCategoryGeneration(documentId)
    await processFoodCultureGeneration(documentId)
    await processMenuImageGeneration(documentId)
    await processDietaryRestrictionsCheck(documentId)
    console.log("非同期エンドポイント処理が全て完了しました")
  } catch (error) {
    console.error("非同期エンドポイント処理でエラーが発生しました:", error)
  }
}

// 各エンドポイント処理を個別の関数に分離
async function processCategoryGeneration(documentId: string): Promise<void> {
  console.log("1. カテゴリー生成を開始...")
  try {
    await callEndpoint(ENDPOINTS.generateCategories, { documentId })
    console.log("カテゴリー生成が完了しました")
  } catch (error) {
    console.error("カテゴリー生成でエラーが発生しました:", error)
  }
}

async function processFoodCultureGeneration(documentId: string): Promise<void> {
  console.log("2. 食文化生成を開始...")
  try {
    await callEndpoint(ENDPOINTS.generateFoodCulture, { documentId })
    console.log("食文化生成が完了しました")
  } catch (error) {
    console.error("食文化生成でエラーが発生しました:", error)
  }
}

async function processMenuImageGeneration(documentId: string): Promise<void> {
  console.log("3. メニュー画像生成を開始...")
  try {
    await callEndpoint(ENDPOINTS.generateMenuImage, {}, "POST", { documentId })
    console.log("メニュー画像生成が完了しました")
  } catch (error) {
    console.error("メニュー画像生成でエラーが発生しました:", error)
  }
}

async function processDietaryRestrictionsCheck(documentId: string): Promise<void> {
  console.log("4. 食事制限チェックを開始...")
  try {
    await callEndpoint(ENDPOINTS.checkDietaryRestrictions, {}, "POST", {
      documentId,
    })
    console.log("食事制限チェックが完了しました")
  } catch (error) {
    console.error("食事制限チェックでエラーが発生しました:", error)
  }
}
