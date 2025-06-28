import { onRequest } from "firebase-functions/v2/https"
import { handleProcessMenuImage } from "../../handlers/menuImageHandler"

// メニュー画像処理エンドポイント
export const processMenuImage = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  handleProcessMenuImage
)
