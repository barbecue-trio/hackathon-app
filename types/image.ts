// =============================================================================
// 画像関連の型定義
// =============================================================================

export interface GeneratedImage {
  base64: string
  mimeType: string
}

export type UploadProgressCallback = (progress: number) => void
