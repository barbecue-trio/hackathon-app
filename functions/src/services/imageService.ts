import * as admin from "firebase-admin"

export async function fetchImageAsBase64(gcsUri: string): Promise<string> {
  try {
    const match = gcsUri.match(/gs:\/\/([^\/]+)\/(.+)/)
    if (!match) {
      throw new Error("Invalid GCS URI")
    }
    const bucketName = match[1]
    const fileName = match[2]

    // Firebase Admin SDKを使用してGCSからファイルを取得
    const bucket = admin.storage().bucket(bucketName)
    const file = bucket.file(fileName)
    const [buffer] = await file.download()

    return buffer.toString("base64")
  } catch (error) {
    console.error("画像取得エラー:", error)
    throw error
  }
}

export function extractMenuNamesFromText(text: string): { name: string; name_jp: string }[] {
  const lines = text.split("\n")
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
