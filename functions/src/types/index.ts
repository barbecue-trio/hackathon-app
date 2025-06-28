// 型定義
export interface MenuItem {
  name: string;
  name_jp: string;
  image_id: string;
  ingredients: string[];
  allergy_ids: string[];
  dietary_restriction_ids: string[];
  category_id: string;
  food_culture: string;
}

export interface MenuCollection {
  menus: MenuItem[];
}

export interface ProcessImageRequest {
  storageId: string;
}

export interface ProcessImageResponse {
  success: boolean;
  documentId?: string;
  error?: string;
  menuCount?: number;
}

export interface GenerateFoodCultureRequest {
  documentId: string;
}

export interface GenerateFoodCultureResponse {
  success: boolean;
  error?: string;
  processedCount?: number;
}
