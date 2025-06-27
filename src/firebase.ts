import { GoogleAIBackend, getAI, getGenerativeModel } from "firebase/ai"
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const storage = getStorage(app)
const ai = getAI(app, { backend: new GoogleAIBackend() })
const modelName = import.meta.env.VITE_FIREBASE_AI_MODEL || "gemini-2.5-flash"
const model = getGenerativeModel(ai, { model: modelName })

export default app
export { analytics, storage, model }
