import { GoogleGenerativeAI } from "@google/generative-ai"
import { geminiApiKey } from "../config"
import type { MenuItem } from "../types"
import { extractMenuNamesFromText, fetchImageAsBase64 } from "./imageService"

export async function extractMenuWithGoogleAI(
  gcsUri: string
): Promise<{ name: string; name_jp: string }[]> {
  try {
    const apiKey = geminiApiKey.value()
    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }
    const genAI = new GoogleGenerativeAI(apiKey)

    const imageData = await fetchImageAsBase64(gcsUri)

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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
- 本日の刺し盛り → {"name": "Today"s Sashimi Platter", "name_jp": "本日の刺し盛り"}
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
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
    ])

    const text = result.response.text()
    console.log("Google AIの応答:", text)

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*\]/)
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

    console.log("抽出されたJSON文字列:", jsonString)

    try {
      const menuData = JSON.parse(jsonString)
      console.log("パースされたメニューデータ:", menuData)

      if (Array.isArray(menuData)) {
        const processedData = menuData
          .map((item) => {
            if (typeof item === "string") {
              // 文字列の場合は、英語名を生成する
              console.log(`文字列アイテム: ${item}`)
              return { name: item, name_jp: item }
            }
            if (item && typeof item === "object" && "name" in item && "name_jp" in item) {
              console.log(`オブジェクトアイテム: ${JSON.stringify(item)}`)
              return { name: item.name, name_jp: item.name_jp }
            }
            console.log(`無効なアイテム: ${JSON.stringify(item)}`)
            return { name: "", name_jp: "" }
          })
          .filter((item) => item.name && item.name_jp)

        console.log("処理後のメニューデータ:", processedData)

        // 文字列配列が返された場合は、日本語名をそのまま英語名として使用
        if (processedData.length > 0 && processedData[0].name === processedData[0].name_jp) {
          console.log("文字列配列が検出されました。日本語名をそのまま使用します...")
          return processedData.map((item) => ({
            name: item.name_jp, // 日本語名をそのまま英語名として使用
            name_jp: item.name_jp,
          }))
        }

        return processedData
      }
      return []
    } catch (parseError) {
      console.error("JSON解析エラー:", parseError)
      console.log("フォールバック: テキストからメニュー名を抽出")
      const menuNames = extractMenuNamesFromText(text)
      const fallbackData = menuNames.map((item) => ({
        name: item.name_jp,
        name_jp: item.name_jp,
      }))
      console.log("フォールバックデータ:", fallbackData)

      // フォールバックでも英語名を生成する
      if (fallbackData.length > 0) {
        console.log("フォールバックデータをそのまま使用します...")
        return fallbackData.map((item) => ({
          name: item.name_jp, // 日本語名をそのまま英語名として使用
          name_jp: item.name_jp,
        }))
      }

      return fallbackData
    }
  } catch (error) {
    console.error("Google AIでの抽出エラー:", error)
    throw error
  }
}

export async function generateFoodCultureWithAI(menuName: string): Promise<string> {
  const maxRetries = 3
  const retryDelay = 1000 // 1秒

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = geminiApiKey.value()
      if (!apiKey) {
        throw new Error("Gemini API key not configured")
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
Please provide a brief explanation of the food culture for "${menuName}":

- When and where it originated
- Why it was created
- Its current status and significance

Please answer in English, 50-100 characters, concise and informative.
`

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      const cleanedText = text.trim().replace(/\n+/g, " ").replace(/\s+/g, " ")

      return cleanedText
    } catch (error) {
      console.error(`"${menuName}"の食文化生成でエラー (試行 ${attempt}/${maxRetries}):`, error)

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        continue
      }

      console.error(`"${menuName}"の食文化生成が${maxRetries}回試行しても失敗しました`)
      return "Failed to generate food culture information."
    }
  }

  return "Failed to generate food culture information."
}

// 全メニューのカテゴリーを一括で判定する関数
export async function determineCategoriesForAllMenus(menus: MenuItem[]): Promise<number[]> {
  try {
    const apiKey = geminiApiKey.value()
    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // メニューリストを作成
    const menuList = menus
      .map((menu, index) => `${index + 1}. ${menu.name} (${menu.name_jp})`)
      .join("\n")

    const prompt = `
以下のメニューリストの各メニューに対して、最も適切なカテゴリーIDを選んでください：

メニューリスト：
${menuList}

カテゴリー分類：
1. 麺系 - ラーメン、うどん、そば、パスタ、スパゲッティなどの麺料理
2. 鍋系 - すき焼き、しゃぶしゃぶ、キムチ鍋、鍋物などの鍋料理
3. 刺身系 - 刺身、カルパッチョ、タルタル、生魚料理など
4. 寿司 - 握り寿司、巻き寿司、手巻き寿司などの寿司料理
5. その他 - 上記のカテゴリーに該当しない料理

必ず以下の形式でJSON配列で回答してください：
[1, 2, 3, 4, 5, ...]

各数字は対応するメニューのカテゴリーIDです。
例：
- ラーメン → 1
- すき焼き → 2
- 刺身盛り合わせ → 3
- 握り寿司 → 4
- 焼き鳥 → 5

説明は不要で、数字の配列のみで回答してください。
`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    console.log("AIの回答:", text)

    // JSON配列を抽出
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      try {
        const categoryIds = JSON.parse(jsonMatch[0])
        if (Array.isArray(categoryIds) && categoryIds.length === menus.length) {
          // 各IDが1-5の範囲内かチェック
          const validIds = categoryIds.map((id) => {
            const numId = Number.parseInt(id)
            return numId >= 1 && numId <= 5 ? numId : 5
          })
          return validIds
        }
      } catch (parseError) {
        console.error("JSON解析エラー:", parseError)
      }
    }

    // AIの回答が不正な場合は、個別に判定
    console.warn(`AIの一括回答が不正でした: "${text}"。個別判定にフォールバックします。`)
    return await determineCategoriesIndividually(menus)
  } catch (error) {
    console.error("一括カテゴリー判定でエラーが発生しました:", error)
    // エラーの場合は個別判定にフォールバック
    return await determineCategoriesIndividually(menus)
  }
}

// 個別判定のフォールバック関数
async function determineCategoriesIndividually(menus: MenuItem[]): Promise<number[]> {
  console.log("個別判定でカテゴリーを判定中...")
  const results: number[] = []

  for (let i = 0; i < menus.length; i++) {
    try {
      const categoryId = await determineCategoryFromMenuName(menus[i].name, menus[i].name_jp)
      results.push(categoryId)
    } catch (error) {
      console.error(`個別判定でエラー: ${menus[i].name}`, error)
      results.push(5) // デフォルト値
    }

    // リクエスト間に少し待機時間を設ける
    if (i < menus.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return results
}

// メニュー名からカテゴリーIDを判定する関数
async function determineCategoryFromMenuName(name: string, nameJp: string): Promise<number> {
  try {
    const apiKey = geminiApiKey.value()
    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
以下のメニュー名を分析して、最も適切なカテゴリーIDを選んでください：

メニュー名（英語）: ${name}
メニュー名（日本語）: ${nameJp}

カテゴリー分類：
1. 麺系 - ラーメン、うどん、そば、パスタ、スパゲッティなどの麺料理
2. 鍋系 - すき焼き、しゃぶしゃぶ、キムチ鍋、鍋物などの鍋料理
3. 刺身系 - 刺身、カルパッチョ、タルタル、生魚料理など
4. 寿司 - 握り寿司、巻き寿司、手巻き寿司などの寿司料理
5. その他 - 上記のカテゴリーに該当しない料理

必ず1から5の数字のみで回答してください。説明は不要です。
例：
- ラーメン → 1
- すき焼き → 2
- 刺身盛り合わせ → 3
- 握り寿司 → 4
- 焼き鳥 → 5
`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const numberMatch = text.match(/\d+/)
    if (numberMatch) {
      const categoryId = Number.parseInt(numberMatch[0])
      if (categoryId >= 1 && categoryId <= 5) {
        return categoryId
      }
    }

    console.warn(`AIの回答が不正でした: "${text}"。デフォルト値5を使用します。`)
    return 5
  } catch (error) {
    console.error(`カテゴリー判定でエラーが発生しました: ${name}`, error)
    // エラーの場合はデフォルトで5（その他）を返す
    return 5
  }
}
