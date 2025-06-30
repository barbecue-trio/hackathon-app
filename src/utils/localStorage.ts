import type { AllergenId } from "types/allergy"
import type { ReligiousRestrictionId } from "types/religious"

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  MENU_COLLECTION_ID: "menuCollectionId",
  DIETARY_RESTRICTIONS: "dietaryRestrictions",
} as const

// Menu Collection ID関連の関数
export const saveMenuCollectionId = (documentId: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.MENU_COLLECTION_ID, documentId)
}

export const getMenuCollectionId = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.MENU_COLLECTION_ID)
}

export const removeMenuCollectionId = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.MENU_COLLECTION_ID)
}

// 汎用的なローカルストレージ関数
export const setLocalStorageItem = (key: string, value: string): void => {
  localStorage.setItem(key, value)
}

export const getLocalStorageItem = (key: string): string | null => {
  return localStorage.getItem(key)
}

export const removeLocalStorageItem = (key: string): void => {
  localStorage.removeItem(key)
}

// 食事制限関連の関数
type UserDietaryRestrictions = {
  allergies: AllergenId[]
  religious: ReligiousRestrictionId[]
  other: string[]
}

export const saveDietaryRestrictions = (dietaryRestrictions: UserDietaryRestrictions): void => {
  setLocalStorageItem(LOCAL_STORAGE_KEYS.DIETARY_RESTRICTIONS, JSON.stringify(dietaryRestrictions))
}

export const getDietaryRestrictions = (): UserDietaryRestrictions => {
  const stored = getLocalStorageItem(LOCAL_STORAGE_KEYS.DIETARY_RESTRICTIONS)
  return stored
    ? JSON.parse(stored)
    : {
        allergies: [],
        religious: [],
        other: [],
      }
}
