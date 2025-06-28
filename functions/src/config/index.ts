import * as admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import { defineString } from "firebase-functions/params"

// 環境変数の定義
export const geminiApiKey = defineString("GEMINI_API_KEY")
export const bucket = defineString("BUCKET")

// Firebase初期化
admin.initializeApp()

// Firestoreインスタンス
export const db = getFirestore("barbecue")
