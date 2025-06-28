import { onRequest } from "firebase-functions/v2/https";
import { handleTestProcessMenuImage } from "../../handlers/testHandler";

// テスト用エンドポイント
export const testProcessMenuImage = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  handleTestProcessMenuImage
);
