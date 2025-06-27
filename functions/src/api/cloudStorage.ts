import { getStorage } from "firebase-admin/storage"

const BACKET_NAME = "barbecue-trio.firebasestorage.app"

/**
 * Google Cloud Storageに画像をアップロードし、公開URLを返します。
 *
 * @param fileName アップロードするファイルの名前
 * @param fileData 画像データのbase64文字列
 * @param contentType 画像のMIMEタイプ
 * @returns アップロードされた画像の公開URL
 * @throws アップロードに失敗した場合にエラーを投げます
 */
export async function uploadToStorage(
  fileName: string,
  fileData: string,
  contentType: string
): Promise<void> {
  try {
    const storage = getStorage()
    const bucket = storage.bucket(BACKET_NAME)
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
