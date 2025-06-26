import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"

/**
 * アップロード進捗を通知するコールバック関数の型
 */
export type UploadProgressCallback = (progress: number) => void

/**
 * 画像ファイルのサイズ制限とフォーマットをチェックする
 * @param file - チェックするファイル
 * @returns バリデーション結果
 */
function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // ファイルサイズチェック（10MB制限）
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "ファイルサイズが大きすぎます。10MB以下のファイルを選択してください。",
    }
  }

  // ファイル形式チェック
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        "サポートされていないファイル形式です。JPEG、PNG、WebP形式のファイルを選択してください。",
    }
  }

  return { isValid: true }
}

/**
 * ファイル名を安全な形式に変換する
 * @param originalName - 元のファイル名
 * @returns 安全なファイル名
 */
function sanitizeFileName(originalName: string): string {
  // 日本語文字や特殊文字を除去し、安全なファイル名を生成
  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // 拡張子を除去
    .replace(/[^a-zA-Z0-9]/g, "") // 英数字以外を除去
    .substring(0, 50) // 長さ制限

  return baseName || "image" // 空の場合はデフォルト名
}

/**
 * 画像ファイルをFirebase Cloud Storageにアップロードする
 * @param file - アップロードする画像ファイル
 * @param folder - ストレージ内のフォルダ名（デフォルト: 'menuImages'）
 * @param progressCallback - アップロード進捗を通知するコールバック（オプション）
 * @returns アップロード完了後のダウンロードURLとファイルパス
 */
export async function uploadImageToStorage(
  file: File,
  folder = "menuImages",
  progressCallback?: UploadProgressCallback
): Promise<{
  downloadURL: string
  filePath: string
  fileSize: number
  contentType: string
}> {
  try {
    // ファイルのバリデーション
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    // 進捗通知
    progressCallback?.(0)

    // ファイル名を一意にするためタイムスタンプを追加
    const timestamp = Date.now()
    const safeName = sanitizeFileName(file.name)
    const extension = file.name.split(".").pop() || "jpg"
    const fileName = `${timestamp}-${safeName}.${extension}`
    const filePath = `${folder}/${fileName}`

    // Storage参照を作成
    const storageRef = ref(storage, filePath)

    // 進捗通知
    progressCallback?.(25)

    // ファイルをアップロード
    console.log("画像をアップロード中...", fileName)
    console.log("ファイルサイズ:", (file.size / 1024 / 1024).toFixed(2), "MB")

    const snapshot = await uploadBytes(storageRef, file)
    console.log("アップロード完了:", snapshot.metadata.fullPath)

    // 進捗通知
    progressCallback?.(75)

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log("ダウンロードURL取得完了:", downloadURL)

    // 進捗通知
    progressCallback?.(100)

    return {
      downloadURL,
      filePath,
      fileSize: file.size,
      contentType: file.type,
    }
  } catch (error) {
    console.error("画像アップロードエラー:", error)

    // Firebase特有のエラーメッセージを分かりやすく変換
    if (error instanceof Error) {
      if (error.message.includes("storage/unauthorized")) {
        throw new Error("アップロード権限がありません。管理者にお問い合わせください。")
      }
      if (error.message.includes("storage/canceled")) {
        throw new Error("アップロードがキャンセルされました。")
      }
      if (error.message.includes("storage/unknown")) {
        throw new Error("不明なエラーが発生しました。しばらく後でもう一度お試しください。")
      }
      if (error.message.includes("storage/retry-limit-exceeded")) {
        throw new Error("リトライ制限に達しました。ネットワーク接続を確認してください。")
      }
    }

    throw new Error(`画像のアップロードに失敗しました: ${error}`)
  }
}

/**
 * カメラキャプチャからBlobを作成してアップロードする
 * @param blob - カメラからキャプチャした画像のBlob
 * @param folder - ストレージ内のフォルダ名
 * @param progressCallback - アップロード進捗を通知するコールバック（オプション）
 * @returns アップロード完了後のダウンロードURLとファイルパス
 */
export async function uploadCameraImageToStorage(
  blob: Blob,
  folder = "menuImages",
  progressCallback?: UploadProgressCallback
): Promise<{
  downloadURL: string
  filePath: string
  fileSize: number
  contentType: string
}> {
  try {
    // ファイルサイズチェック（10MB制限）
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (blob.size > maxSize) {
      throw new Error("画像サイズが大きすぎます。画質を下げて再度お試しください。")
    }

    // 進捗通知
    progressCallback?.(0)

    // Blobからファイル名を生成
    const timestamp = Date.now()
    const fileName = `camera-capture-${timestamp}.jpg`
    const filePath = `${folder}/${fileName}`

    // Storage参照を作成
    const storageRef = ref(storage, filePath)

    // 進捗通知
    progressCallback?.(25)

    // Blobをアップロード
    console.log("カメラ画像をアップロード中...", fileName)
    console.log("ファイルサイズ:", (blob.size / 1024 / 1024).toFixed(2), "MB")

    const snapshot = await uploadBytes(storageRef, blob)
    console.log("アップロード完了:", snapshot.metadata.fullPath)

    // 進捗通知
    progressCallback?.(75)

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log("ダウンロードURL取得完了:", downloadURL)

    // 進捗通知
    progressCallback?.(100)

    return {
      downloadURL,
      filePath,
      fileSize: blob.size,
      contentType: blob.type || "image/jpeg",
    }
  } catch (error) {
    console.error("カメラ画像アップロードエラー:", error)

    // Firebase特有のエラーメッセージを分かりやすく変換
    if (error instanceof Error) {
      if (error.message.includes("storage/unauthorized")) {
        throw new Error("アップロード権限がありません。管理者にお問い合わせください。")
      }
      if (error.message.includes("storage/canceled")) {
        throw new Error("アップロードがキャンセルされました。")
      }
      if (error.message.includes("storage/unknown")) {
        throw new Error("不明なエラーが発生しました。しばらく後でもう一度お試しください。")
      }
    }

    throw new Error(`カメラ画像のアップロードに失敗しました: ${error}`)
  }
}
