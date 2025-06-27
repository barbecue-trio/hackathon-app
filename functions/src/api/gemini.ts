import { GoogleGenAI, Modality } from "@google/genai"
import * as logger from "firebase-functions/logger"

const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" })

export type ImageData = {
  base64: string
  mimeType: string
}

/**
 * Gemini APIを使って画像を生成し、base64文字列とMIMEタイプを返します。
 *
 * @param prompt 画像生成のためのプロンプト
 * @returns 生成された画像のbase64文字列とMIMEタイプのオブジェクト。生成に失敗した場合はnullを返します。
 */
export async function generateImage(prompt: string): Promise<ImageData | null> {
  const MAX_RETRIES = 3
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: prompt,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
      })
      if (
        !res ||
        !res.candidates ||
        res.candidates.length === 0 ||
        !res.candidates[0].content ||
        !res.candidates[0].content.parts
      ) {
        throw new Error("No candidates returned from Gemini API")
      }
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data
          if (!imageData) {
            throw new Error("No image data found in the inline data")
          }
          const mimeType = part.inlineData.mimeType
          if (!mimeType) {
            throw new Error("No mimeType found in the inline data")
          }
          return { base64: imageData, mimeType: mimeType }
        }
      }
      throw new Error("No image data found in any part")
    } catch (err) {
      logger.warn("Gemini API error", err)
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
      }
    }
  }
  return null
}
