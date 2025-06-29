// =============================================================================
// カテゴリ関連の型定義と定数
// =============================================================================

export const CATEGORIES = {
  NOODLE: { id: 1, name: "麺系" },
  HOTPOT: { id: 2, name: "鍋系" },
  SASHIMI: { id: 3, name: "刺身系" },
  SUSHI: { id: 4, name: "寿司" },
  OTHER: { id: 5, name: "その他" },
} as const

export type CategoryKey = keyof typeof CATEGORIES
export type Category = (typeof CATEGORIES)[CategoryKey]
export type CategoryId = (typeof CATEGORIES)[keyof typeof CATEGORIES]["id"]

// ヘルパー関数用のマップ
export const categoryIdMap: Record<number, string> = Object.values(CATEGORIES).reduce(
  (acc, category) => {
    acc[category.id] = category.name
    return acc
  },
  {} as Record<number, string>
)

// リスト型
export const categoryList: Category[] = Object.values(CATEGORIES)
