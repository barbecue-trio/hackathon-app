// =============================================================================
// 宗教的制約関連の型定義と定数
// =============================================================================

export const RELIGIOUS_RESTRICTIONS = {
  HALAL: { id: 1, name: "Halal" },
  KOSHER: { id: 2, name: "Kosher" },
  HINDU_AHIMSA_VEGETARIAN: { id: 3, name: "Hindu Ahimsa Vegetarian" },
  BUDDHIST_VEGETARIAN: { id: 4, name: "Buddhist Vegetarian" },
  JAIN_VEGETARIAN: { id: 5, name: "Jain Vegetarian" },
  ITAL_DIET: { id: 6, name: "Ital Diet" },
  SEVENTH_DAY_ADVENTIST_DIET: { id: 7, name: "Seventh-day Adventist Diet" },
  MORMON_WORD_OF_WISDOM: { id: 8, name: "Mormon Word of Wisdom" },
  SIKH_DIET: { id: 9, name: "Sikh Diet" },
} as const

export type ReligiousRestrictionsKey = keyof typeof RELIGIOUS_RESTRICTIONS
export type ReligiousRestriction = (typeof RELIGIOUS_RESTRICTIONS)[ReligiousRestrictionsKey]
export type ReligiousRestrictionId =
  (typeof RELIGIOUS_RESTRICTIONS)[keyof typeof RELIGIOUS_RESTRICTIONS]["id"]

// ヘルパー関数用のマップ
export const religiousRestrictionIdMap: Record<number, string> = Object.values(
  RELIGIOUS_RESTRICTIONS
).reduce(
  (acc, restriction) => {
    acc[restriction.id] = restriction.name
    return acc
  },
  {} as Record<number, string>
)

// 宗教的制約名から宗教的制約IDへのマップ（逆引き）
export const religiousRestrictionNameToIdMap: Record<string, number> = Object.entries(
  religiousRestrictionIdMap
).reduce(
  (acc, [id, name]) => {
    acc[name] = Number(id)
    return acc
  },
  {} as Record<string, number>
)

// リスト型
export const religiousRestrictionList: ReligiousRestriction[] =
  Object.values(RELIGIOUS_RESTRICTIONS)

// 宗教的制約名のリスト
export const religiousRestrictionNameList = Object.values(RELIGIOUS_RESTRICTIONS).map(
  (restriction) => restriction.name
)
