import { doc, getDoc } from "firebase/firestore"
import type { MenuCollection } from "../../types"
import { firestore } from "../firebase"

export async function getMenuCollection(documentId: string): Promise<MenuCollection> {
  const docRef = doc(firestore, "menu_collections", documentId)
  const docSnapshot = await getDoc(docRef)

  if (!docSnapshot.exists()) {
    throw new Error(`ドキュメント ${documentId} が見つかりません`)
  }

  return docSnapshot.data() as MenuCollection
}
