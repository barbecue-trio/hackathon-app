import * as admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"

// 環境変数の定義
export const geminiApiKey = process.env.GEMINI_API_KEY
export const bucket = process.env.BUCKET

// Firebase初期化
admin.initializeApp()

// Firestoreインスタンス
export const db = getFirestore("barbecue")
