import { onRequest } from "firebase-functions/v2/https"
import { handleGenerateMenuImage } from "../../handlers/menuImageHandler"

// メニュー画像専用エンドポイント
export const generateMenuImage = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  handleGenerateMenuImage
)
