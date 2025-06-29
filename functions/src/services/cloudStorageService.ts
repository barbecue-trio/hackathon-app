import type { GeneratedImage } from "../types"
import { getStorage } from "firebase-admin/storage"
import { bucket as bucketName } from "../config"
import { extMap } from "../constant"

// メニュー画像をアップロードする関数
export async function uploadMenuImage(
  imageName: string,
  imageData: GeneratedImage
): Promise<string> {
  const timestamp = Date.now().toString()
  const ext = extMap[imageData.mimeType] || "bin"
  const fileName = `${timestamp}-${imageName}.${ext}`
  const fileData = imageData.base64
  const contentType = imageData.mimeType

  await uploadToStorage(fileName, fileData, contentType)
  return fileName
}

// Cloud Storageに画像をアップロードする関数
async function uploadToStorage(
  fileName: string,
  fileData: string,
  contentType: string
): Promise<void> {
  try {
    const storage = getStorage()
    const bucket = storage.bucket(bucketName)
    const buffer = Buffer.from(fileData, "base64")
    const filePath = `menuItemImage/${fileName}`
    const file = bucket.file(filePath)
    await file.save(buffer, {
      contentType: contentType,
      public: true,
      resumable: false,
    })
  } catch (error) {
    throw new Error(`Upload to Cloud Storage failed. ${error}`)
  }
}
