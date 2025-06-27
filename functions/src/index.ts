import { GoogleGenerativeAI } from '@google/generative-ai'
import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { defineString } from 'firebase-functions/params'
import { onRequest } from 'firebase-functions/v2/https'

// 環境変数の定義
const geminiApiKey = defineString('GEMINI_API_KEY')
const bucket = defineString('BUCKET')

// 型定義
interface MenuItem {
  name: string
  name_jp: string
  image_id: string
  ingredients: string[]
  allergy_ids: string[]
  dietary_restriction_ids: string[]
  category_id: string
  food_culture: string
}

interface MenuCollection {
  menus: MenuItem[]
}

interface ProcessImageRequest {
  storageId: string
}

interface ProcessImageResponse {
  success: boolean
  documentId?: string
  error?: string
  menuCount?: number
}

interface GenerateFoodCultureRequest {
  documentId: string
}

interface GenerateFoodCultureResponse {
  success: boolean
  error?: string
  processedCount?: number
}

admin.initializeApp()

const db = getFirestore('barbecue')

export const processMenuImage = onRequest(
  {
    cors: true,
    region: 'asia-northeast1',
    memory: '512MiB',
  },
  async (request, response) => {
    try {
      if (request.method !== 'POST') {
        response.status(405).json({
          success: false,
          error: 'Method not allowed. Use POST.',
        })
        return
      }

      const { storageId }: ProcessImageRequest = request.body

      if (!storageId) {
        response.status(400).json({
          success: false,
          error: 'storageId is required',
        })
        return
      }

      console.log('ストレージIDが受け取られました:', storageId)

      const fullStorageId = storageId.startsWith('menuImages/')
        ? storageId
        : `menuImages/${storageId}`
      const gcsUri = `gs://${bucket.value()}/${fullStorageId}`

      const menuNames = await extractMenuWithGoogleAI(gcsUri)

      if (menuNames.length === 0) {
        response.status(400).json({
          success: false,
          error: 'メニュー名が抽出できませんでした',
        })
        return
      }

      // 新しいデータ構造でメニュー情報を作成
      const menuCollection: MenuCollection = {
        menus: menuNames.map((menuName) => ({
          name: menuName.name,
          name_jp: menuName.name_jp,
          image_id: '',
          ingredients: [],
          allergy_ids: [],
          dietary_restriction_ids: [],
          category_id: '',
          food_culture: '',
        })),
      }

      const documentId = await saveMenuData(menuCollection)

      console.log('メニュー情報の保存が完了しました。ドキュメントID:', documentId)

      // 食文化生成処理を非同期で開始（並列処理）
      generateFoodCultureForDocument(documentId).catch((error: unknown) => {
        console.error('食文化生成処理でエラーが発生しました:', error)
      })

      // 成功レスポンス
      const responseData: ProcessImageResponse = {
        success: true,
        documentId: documentId,
        menuCount: menuNames.length,
      }

      response.status(200).json(responseData)
    } catch (error) {
      console.error('エラーが発生しました:', error)
      response.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
)

// 食文化生成専用エンドポイント
export const generateFoodCulture = onRequest(
  {
    cors: true,
    region: 'asia-northeast1',
    memory: '512MiB',
  },
  async (request, response) => {
    try {
      // POSTリクエストのみ許可
      if (request.method !== 'POST') {
        response.status(405).json({
          success: false,
          error: 'Method not allowed. Use POST.',
        })
        return
      }

      const { documentId }: GenerateFoodCultureRequest = request.body

      if (!documentId) {
        response.status(400).json({
          success: false,
          error: 'documentId is required',
        })
        return
      }

      // 食文化生成処理を実行
      const processedCount = await generateFoodCultureForDocument(documentId)

      const responseData: GenerateFoodCultureResponse = {
        success: true,
        processedCount: processedCount,
      }

      response.status(200).json(responseData)
    } catch (error) {
      console.error('食文化生成エラーが発生しました:', error)
      response.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
)

// テスト用エンドポイント
export const testProcessMenuImage = onRequest(
  {
    cors: true,
    region: 'asia-northeast1',
    memory: '512MiB',
  },
  async (request, response) => {
    try {
      // GETリクエストでテスト用の固定画像を使用
      if (request.method !== 'GET') {
        response.status(405).json({
          success: false,
          error: 'Method not allowed. Use GET for testing.',
        })
        return
      }

      const testStorageId = 'menuImages/testMenu.webp'

      // storageIdにmenuImages/プレフィックスが含まれていない場合は追加
      const fullStorageId = testStorageId.startsWith('menuImages/')
        ? testStorageId
        : `menuImages/${testStorageId}`
      const gcsUri = `gs://${bucket.value()}/${fullStorageId}`

      // Google AIでメニュー情報を抽出
      const menuNames = await extractMenuWithGoogleAI(gcsUri)

      if (menuNames.length === 0) {
        response.status(400).json({
          success: false,
          error: 'メニュー名が抽出できませんでした',
        })
        return
      }

      // 新しいデータ構造でメニュー情報を作成
      const menuCollection: MenuCollection = {
        menus: menuNames.map((menuName) => ({
          name: menuName.name,
          name_jp: menuName.name_jp,
          image_id: '',
          ingredients: [],
          allergy_ids: [],
          dietary_restriction_ids: [],
          category_id: '',
          food_culture: '',
        })),
      }

      const documentId = await saveMenuData(menuCollection)

      console.log('メニュー情報の保存が完了しました。ドキュメントID:', documentId)

      // 食文化生成処理を非同期で開始（並列処理）
      generateFoodCultureForDocument(documentId).catch((error: unknown) => {
        console.error('食文化生成処理でエラーが発生しました:', error)
      })

      // 成功レスポンス
      const responseData: ProcessImageResponse = {
        success: true,
        documentId: documentId,
        menuCount: menuNames.length,
      }

      response.status(200).json(responseData)
    } catch (error) {
      console.error('テストエラーが発生しました:', error)
      response.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
)

async function extractMenuWithGoogleAI(
  gcsUri: string
): Promise<{ name: string; name_jp: string }[]> {
  try {
    const apiKey = geminiApiKey.value()
    if (!apiKey) {
      throw new Error('Gemini API key not configured')
    }
    const genAI = new GoogleGenerativeAI(apiKey)

    const imageData = await fetchImageAsBase64(gcsUri)

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
この画像は居酒屋のメニューです。以下の条件でメニュー名を抽出してください：
条件：
1. メニュー名のみを抽出（価格は除外）
2. カテゴリ名（「とりあえず」「おすすめメニュー」「揚げもの」「刺身」「焼きもの」など）は除外
3. 価格のみの行は除外
4. 複合メニューは必ず個別のメニューに分割
   - 「おにぎり 梅・シャケ・高菜」→「梅おにぎり」「シャケおにぎり」「高菜おにぎり」
   - 「刺身盛り合わせ マグロ・サーモン・ブリ」→「マグロ刺身」「サーモン刺身」「ブリ刺身」
   - 「焼き鳥 もも・ねぎま・つくね」→「もも焼き鳥」「ねぎま焼き鳥」「つくね焼き鳥」
5. メニュー名は具体的で分かりやすく
6. 重複は除外
7. 食材の種類が明確な場合は、その食材名を含める

必ず以下の形式でJSON配列で返してください：
[
  {
    "name": "英語でのメニュー名",
    "name_jp": "日本語でのメニュー名"
  }
]

英語名は一般的な英語表記を使用し、日本語名は元のメニュー表記をそのまま使用してください。
例：
- 焼き鳥 → {"name": "Yakitori", "name_jp": "焼き鳥"}
- 刺身盛り合わせ → {"name": "Sashimi Platter", "name_jp": "刺身盛り合わせ"}
- 梅おにぎり → {"name": "Umeboshi Onigiri", "name_jp": "梅おにぎり"}
- 冷奴 → {"name": "Hiyayakko", "name_jp": "冷奴"}
- 枝豆 → {"name": "Edamame", "name_jp": "枝豆"}
- 厚焼き玉子 → {"name": "Tamagoyaki", "name_jp": "厚焼き玉子"}
- きゅうり一本漬け → {"name": "Cucumber Pickles", "name_jp": "きゅうり一本漬け"}
- キムチ → {"name": "Kimchi", "name_jp": "キムチ"}
- チャンジャ → {"name": "Jangjorim", "name_jp": "チャンジャ"}
- 鶏のからあげ → {"name": "Karaage Chicken", "name_jp": "鶏のからあげ"}
- フライドポテト → {"name": "French Fries", "name_jp": "フライドポテト"}
- 厚揚げ → {"name": "Agedashi Tofu", "name_jp": "厚揚げ"}
- メンチカツ → {"name": "Minchi Katsu", "name_jp": "メンチカツ"}
- なんこつのからあげ → {"name": "Karaage Cartilage", "name_jp": "なんこつのからあげ"}
- コロッケ → {"name": "Korokke", "name_jp": "コロッケ"}
- ひとくちぎょうざ → {"name": "Gyoza", "name_jp": "ひとくちぎょうざ"}
- 焼き明太子 → {"name": "Grilled Mentaiko", "name_jp": "焼き明太子"}
- ホッケ焼き → {"name": "Grilled Hokke", "name_jp": "ホッケ焼き"}
- チーズ春巻き → {"name": "Cheese Spring Rolls", "name_jp": "チーズ春巻き"}
- トマトとモッツァレラ → {"name": "Tomato and Mozzarella", "name_jp": "トマトとモッツァレラ"}
- シーザーサラダ → {"name": "Caesar Salad", "name_jp": "シーザーサラダ"}
- ポテトサラダ → {"name": "Potato Salad", "name_jp": "ポテトサラダ"}
- じゃこサラダ → {"name": "Chirimen Jako Salad", "name_jp": "じゃこサラダ"}
- 本日の刺し盛り → {"name": "Today's Sashimi Platter", "name_jp": "本日の刺し盛り"}
- 鰹のたたき → {"name": "Tataki Bonito", "name_jp": "鰹のたたき"}
- ゴマ鯖 → {"name": "Sesame Mackerel", "name_jp": "ゴマ鯖"}
- ぶり → {"name": "Buri", "name_jp": "ぶり"}
- サーモン → {"name": "Salmon", "name_jp": "サーモン"}
- シャケおにぎり → {"name": "Salmon Onigiri", "name_jp": "シャケおにぎり"}
- 高菜おにぎり → {"name": "Takana Onigiri", "name_jp": "高菜おにぎり"}
- 明太おにぎり → {"name": "Mentaiko Onigiri", "name_jp": "明太おにぎり"}
- お茶漬け → {"name": "Ochazuke", "name_jp": "お茶漬け"}
- チャーハン → {"name": "Fried Rice", "name_jp": "チャーハン"}

必ずJSON形式で返してください。説明文は不要です。
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      },
    ])

    const text = result.response.text()
    console.log('Google AIの応答:', text)

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*\]/)
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

    console.log('抽出されたJSON文字列:', jsonString)

    try {
      const menuData = JSON.parse(jsonString)
      console.log('パースされたメニューデータ:', menuData)

      if (Array.isArray(menuData)) {
        const processedData = menuData
          .map((item) => {
            if (typeof item === 'string') {
              // 文字列の場合は、英語名を生成する
              console.log(`文字列アイテム: ${item}`)
              return { name: item, name_jp: item }
            }
            if (item && typeof item === 'object' && 'name' in item && 'name_jp' in item) {
              console.log(`オブジェクトアイテム: ${JSON.stringify(item)}`)
              return { name: item.name, name_jp: item.name_jp }
            }
            console.log(`無効なアイテム: ${JSON.stringify(item)}`)
            return { name: '', name_jp: '' }
          })
          .filter((item) => item.name && item.name_jp)

        console.log('処理後のメニューデータ:', processedData)

        // 文字列配列が返された場合は、日本語名をそのまま英語名として使用
        if (processedData.length > 0 && processedData[0].name === processedData[0].name_jp) {
          console.log('文字列配列が検出されました。日本語名をそのまま使用します...')
          return processedData.map((item) => ({
            name: item.name_jp, // 日本語名をそのまま英語名として使用
            name_jp: item.name_jp,
          }))
        }

        return processedData
      }
      return []
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError)
      console.log('フォールバック: テキストからメニュー名を抽出')
      const menuNames = extractMenuNamesFromText(text)
      const fallbackData = menuNames.map((item) => ({
        name: item.name_jp,
        name_jp: item.name_jp,
      }))
      console.log('フォールバックデータ:', fallbackData)

      // フォールバックでも英語名を生成する
      if (fallbackData.length > 0) {
        console.log('フォールバックデータをそのまま使用します...')
        return fallbackData.map((item) => ({
          name: item.name_jp, // 日本語名をそのまま英語名として使用
          name_jp: item.name_jp,
        }))
      }

      return fallbackData
    }
  } catch (error) {
    console.error('Google AIでの抽出エラー:', error)
    throw error
  }
}

async function fetchImageAsBase64(gcsUri: string): Promise<string> {
  try {
    const match = gcsUri.match(/gs:\/\/([^\/]+)\/(.+)/)
    if (!match) {
      throw new Error('Invalid GCS URI')
    }
    const bucketName = match[1]
    const fileName = match[2]

    // Firebase Admin SDKを使用してGCSからファイルを取得
    const bucket = admin.storage().bucket(bucketName)
    const file = bucket.file(fileName)
    const [buffer] = await file.download()

    return buffer.toString('base64')
  } catch (error) {
    console.error('画像取得エラー:', error)
    throw error
  }
}

function extractMenuNamesFromText(text: string): { name: string; name_jp: string }[] {
  const lines = text.split('\n')
  const menuNames: { name: string; name_jp: string }[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.match(/^\d+円$/) && !trimmedLine.match(/^[¥￥]\d+/)) {
      // 価格のみの行を除外
      if (trimmedLine.length > 1 && !trimmedLine.match(/^[0-9¥￥\s]+$/)) {
        // 数字と記号のみの行を除外
        menuNames.push({ name: trimmedLine, name_jp: trimmedLine })
      }
    }
  }

  return menuNames
}

async function saveMenuData(menuCollection: MenuCollection) {
  try {
    const docRef = db.collection('menu_collections').doc()
    await docRef.set({
      ...menuCollection,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    })
    console.log(`${menuCollection.menus.length}個のメニューを保存しました`)
    console.log('ドキュメントID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Firestore保存エラー:', error)
    throw error
  }
}

// 食文化生成のメイン関数
async function generateFoodCultureForDocument(documentId: string): Promise<number> {
  try {
    const docRef = db.collection('menu_collections').doc(documentId)
    const doc = await docRef.get()

    if (!doc.exists) {
      throw new Error(`ドキュメント ${documentId} が見つかりません`)
    }

    const menuCollection = doc.data() as MenuCollection

    const batchSize = 5 // 一度に処理するメニュー数
    const delayBetweenBatches = 1000 // バッチ間の待機時間（ミリ秒）
    const delayBetweenRequests = 500 // リクエスト間の待機時間（ミリ秒）

    const results: { index: number; foodCulture: string }[] = []

    for (let i = 0; i < menuCollection.menus.length; i += batchSize) {
      const batch = menuCollection.menus.slice(i, i + batchSize)
      console.log(
        `バッチ ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          menuCollection.menus.length / batchSize
        )} を処理中...`
      )

      // バッチ内で並列処理
      const batchPromises = batch.map(async (menu, batchIndex) => {
        const globalIndex = i + batchIndex
        try {
          console.log(
            `メニュー ${globalIndex + 1}/${menuCollection.menus.length}: ${
              menu.name
            } の食文化を生成中...`
          )

          // リクエスト間に少し待機時間を設ける
          if (batchIndex > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests))
          }

          const foodCulture = await generateFoodCultureWithAI(menu.name)
          return { index: globalIndex, foodCulture }
        } catch (error) {
          console.error(`メニュー ${menu.name} の食文化生成でエラー:`, error)
          return {
            index: globalIndex,
            foodCulture: '食文化情報の生成に失敗しました。',
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      if (i + batchSize < menuCollection.menus.length) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches))
      }
    }

    const updatedMenus = [...menuCollection.menus]
    for (const { index, foodCulture } of results) {
      updatedMenus[index].food_culture = foodCulture
    }

    // Firestoreを更新
    await docRef.update({
      menus: updatedMenus,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    })

    return results.length
  } catch (error) {
    console.error('食文化生成処理でエラーが発生しました:', error)
    throw error
  }
}

async function generateFoodCultureWithAI(menuName: string): Promise<string> {
  const maxRetries = 3
  const retryDelay = 1000 // 1秒

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = geminiApiKey.value()
      if (!apiKey) {
        throw new Error('Gemini API key not configured')
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `
Please provide a brief explanation of the food culture for "${menuName}":

- When and where it originated
- Why it was created
- Its current status and significance

Please answer in English, 50-100 characters, concise and informative.
`

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      const cleanedText = text.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ')

      return cleanedText
    } catch (error) {
      console.error(`「${menuName}」の食文化生成でエラー (試行 ${attempt}/${maxRetries}):`, error)

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        continue
      }

      console.error(`「${menuName}」の食文化生成が${maxRetries}回試行しても失敗しました`)
      return 'Failed to generate food culture information.'
    }
  }

  return 'Failed to generate food culture information.'
}
