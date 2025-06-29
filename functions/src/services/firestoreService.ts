import type { MenuCollection } from "@/types"
import * as admin from "firebase-admin"
import { db } from "../config"

export async function saveMenuData(menuCollection: MenuCollection): Promise<string> {
  try {
    const docRef = db.collection("menu_collections").doc()
    await docRef.set({
      ...menuCollection,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    })
    console.log(`${menuCollection.menus.length}個のメニューを保存しました`)
    console.log("ドキュメントID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Firestore保存エラー:", error)
    throw error
  }
}

export async function getMenuCollection(documentId: string): Promise<MenuCollection> {
  const docRef = db.collection("menu_collections").doc(documentId)
  const doc = await docRef.get()

  if (!doc.exists) {
    throw new Error(`ドキュメント ${documentId} が見つかりません`)
  }

  return doc.data() as MenuCollection
}

export async function updateMenuCollection(
  documentId: string,
  menuCollection: MenuCollection
): Promise<void> {
  const docRef = db.collection("menu_collections").doc(documentId)
  await docRef.update({
    menus: menuCollection.menus,
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  })
}
