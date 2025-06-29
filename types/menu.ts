// =============================================================================
// メニュー関連の型定義
// =============================================================================
import type { AllergenId } from "./allergy"
import type { CategoryId } from "./category"
import type { ReligiousRestrictionId } from "./religious"

export interface MenuItem {
  name: string
  name_jp: string
  image_id: string
  ingredients: string[]
  allergy_ids: AllergenId[]
  dietary_restriction_ids: ReligiousRestrictionId[]
  category_id: CategoryId
  food_culture: string
}

export interface MenuCollection {
  menus: MenuItem[]
}
