import { imageModel } from "../firebase"

export type ImageData = {
  base64: string
  mimeType: string
}

/**
 * プロンプトから画像を生成する
 * @param {string} prompt - 画像生成のためのプロンプト
 * @returns {Promise<ImageData | null>} 生成された画像のデータ、またはエラー時にnull
 */
export const generateImage = async (prompt: string): Promise<ImageData | null> => {
  try {
    const result = await imageModel.generateContent(prompt)
    const inlineDataParts = result.response.inlineDataParts()
    if (inlineDataParts?.[0]) {
      const image = inlineDataParts[0].inlineData
      return { base64: image.data, mimeType: image.mimeType }
    }
  } catch (error) {
    console.error("Error generate image:", error)
    return null
  }

  return null
}
