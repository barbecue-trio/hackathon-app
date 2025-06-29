// =============================================================================
// API関連の型定義
// =============================================================================

export interface ProcessImageRequest {
  storageId: string
}

export interface ProcessImageResponse {
  success: boolean
  documentId?: string
  error?: string
  menuCount?: number
}

export interface GenerateFoodCultureRequest {
  documentId: string
}

export interface GenerateFoodCultureResponse {
  success: boolean
  error?: string
  processedCount?: number
}

export interface MenuProcessingResponse {
  success: boolean
  documentId: string
  menuCount: number
}
