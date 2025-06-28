import * as admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import * as logger from "firebase-functions/logger"
import { onRequest } from "firebase-functions/v2/https"
import { uploadToStorage } from "./api/cloudStorage"
import { type ImageData, generateImage } from "./api/gemini"

admin.initializeApp()
const db = getFirestore("barbecue")
const COLLECTION_ID = "menu_collections"
const extMap: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export type MenuItem = {
  name: string
  image_id: string
  ingredients: string[]
  allergy_ids: number[]
  dietary_restriction_ids: number[]
  category_id: string
}

export type MenuCollection = {
  menus: MenuItem[]
}

export const getMenuImage = onRequest({ timeoutSeconds: 300 }, async (req, res) => {
  const documentId = req.query.documentId as string | undefined
  if (!documentId) {
    res.status(400).json({ error: "documentId are required" })
    return
  }
  try {
    const docRef = db.collection(COLLECTION_ID).doc(documentId)
    const docSnap = await docRef.get()
    if (!docSnap.exists) {
      res.status(404).json({ error: "Document not found" })
      return
    }
    const docData = docSnap.data() as MenuCollection | undefined
    if (!docData || !docData.menus) {
      res.status(404).json({ error: "No menus found in the document" })
      return
    }
    const menus = docData.menus as MenuItem[]
    const updatedMenus: MenuItem[] = await Promise.all(
      menus.map((menu) => generateImageAndUpload(menu))
    )
    await docRef.update({ menus: updatedMenus })

    res.sendStatus(200)
  } catch (error) {
    logger.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

/**
 * メニューの画像を生成し、Cloud Storageにアップロードします。
 *
 * @param menu メニューアイテム
 * @returns 画像IDを含むメニューアイテム
 */
async function generateImageAndUpload(menu: MenuItem): Promise<MenuItem> {
  const imageData = await generateMenuImage(menu.name)
  // 画像生成に失敗した場合はファイル名は空文字列を返す
  const fileName = imageData ? await uploadMenuImage(menu.name, imageData) : ""
  return { ...menu, image_id: fileName }
}

/**
 * メニュー名を元にGemini APIを使って画像を生成します。
 *
 * @param menuName メニュー名
 * @returns 生成された画像のbase64文字列とMIMEタイプのオブジェクト。生成に失敗した場合はnullを返します。
 */
async function generateMenuImage(menuName: string): Promise<ImageData | null> {
  const prompt = `
料理名：${menuName}の画像を生成してください。
生成する際には以下の条件に従ってください。

## 条件
- 画像のスタイル: 写実的で食品サンプルやディスプレイ用の料理写真
- 画像のテーマ: ${menuName}の料理が主役となるように、他の要素は一切含めない
- 画像の背景: シンプルで料理が引き立つように、背景は白または淡い色にしてください
- 画像の構図: 料理が中央に配置され、全体がよく見えるように、クローズアップで、余計なものが写り込まないようにしてください
- **文字、ロゴ、ブランド名、日付、透かし、その他のテキストは一切含めないでください。**
- **人間、手、食器の一部（料理を盛る皿以外）、その他の物体は含めないでください。**
- [ID: ${Date.now()}]
`

  return await generateImage(prompt)
}

/**
 * メニュー画像をCloud Storageにアップロードし、ファイル名を返します。
 *
 * @param imageName 画像の名前
 * @param imageData 画像データのbase64文字列とMIMEタイプ
 * @returns アップロードされた画像のファイル名
 */
async function uploadMenuImage(imageName: string, imageData: ImageData): Promise<string> {
  const timestamp = Date.now().toString()
  const ext = extMap[imageData.mimeType] || "bin"
  const fileName = `${timestamp}-${imageName}.${ext}`
  const fileData = imageData.base64
  const contentType = imageData.mimeType

  await uploadToStorage(fileName, fileData, contentType)
  return fileName
}
