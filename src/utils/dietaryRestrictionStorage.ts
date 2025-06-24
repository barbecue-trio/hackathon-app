import type { UserDietaryRestrictions } from "../types/dietaryRestrictions"

const STORAGE_KEY = "dietaryRestrictions"

/**
 * ユーザーの食事制限情報をローカルストレージから読み込みます。
 * 食事制限情報が存在しない場合、空の食事制限情報を返します。
 * @returns {UserDietaryRestrictions} ユーザーの食事制限情報
 */
export const loadDietaryRestrictions = (): UserDietaryRestrictions => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored
    ? JSON.parse(stored)
    : {
        allergies: [],
        religiousRestrictions: [],
        otherRestrictions: [],
      }
}

/**
 * ユーザーの食事制限情報をローカルストレージに保存します。
 * @param {UserDietaryRestrictions} restrictions ユーザーの食事制限情報
 */
export const saveDietaryRestrictions = (restrictions: UserDietaryRestrictions): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restrictions))
}
