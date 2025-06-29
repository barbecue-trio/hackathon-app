// =============================================================================
// アレルギー関連の型定義と定数
// =============================================================================

export const ALLERGENS = {
  EGG: { id: 1, name: "Egg" },
  MILK: { id: 2, name: "Milk" },
  WHEAT: { id: 3, name: "Wheat" },
  BUCKWHEAT: { id: 4, name: "Buckwheat" },
  PEANUT: { id: 5, name: "Peanut" },
  SHRIMP: { id: 6, name: "Shrimp" },
  CRAB: { id: 7, name: "Crab" },
  WALNUT: { id: 8, name: "Walnut" },
  ALMOND: { id: 9, name: "Almond" },
  ABALONE: { id: 10, name: "Abalone" },
  SQUID: { id: 11, name: "Squid" },
  SALMON_ROE: { id: 12, name: "Salmon Roe" },
  ORANGE: { id: 13, name: "Orange" },
  CASHEW_NUT: { id: 14, name: "Cashew Nut" },
  KIWI_FRUIT: { id: 15, name: "Kiwi Fruit" },
  BEEF: { id: 16, name: "Beef" },
  SESAME: { id: 17, name: "Sesame" },
  SALMON: { id: 18, name: "Salmon" },
  MACKEREL: { id: 19, name: "Mackerel" },
  SOYBEAN: { id: 20, name: "Soybean" },
  CHICKEN: { id: 21, name: "Chicken" },
  BANANA: { id: 22, name: "Banana" },
  PORK: { id: 23, name: "Pork" },
  MACADAMIA_NUT: { id: 24, name: "Macadamia Nut" },
  PEACH: { id: 25, name: "Peach" },
  YAM: { id: 26, name: "Yam" },
  APPLE: { id: 27, name: "Apple" },
  GELATIN: { id: 28, name: "Gelatin" },
} as const

export type AllergyKey = keyof typeof ALLERGENS
export type Allergy = (typeof ALLERGENS)[AllergyKey]
export type AllergenId = (typeof ALLERGENS)[keyof typeof ALLERGENS]["id"]

// ヘルパー関数用のマップ
export const allergyIdMap: Record<number, string> = Object.values(ALLERGENS).reduce(
  (acc, allergy) => {
    acc[allergy.id] = allergy.name
    return acc
  },
  {} as Record<number, string>
)

// アレルゲン名からアレルゲンIDへのマップ（逆引き
export const allergyNameToIdMap: Record<string, number> = Object.entries(allergyIdMap).reduce(
  (acc, [id, name]) => {
    acc[name] = Number(id)
    return acc
  },
  {} as Record<string, number>
)

// リスト型
export const allergyList: Allergy[] = Object.values(ALLERGENS)

// アレルゲン名のリスト
export const allergenNameList = Object.values(ALLERGENS).map((allergen) => allergen.name)
