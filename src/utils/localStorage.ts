// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  MENU_COLLECTION_ID: "menuCollectionId",
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
