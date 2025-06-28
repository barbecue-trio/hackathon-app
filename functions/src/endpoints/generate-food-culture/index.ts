import { onRequest } from "firebase-functions/v2/https";
import { handleGenerateFoodCulture } from "../../handlers/foodCultureHandler";

// 食文化生成専用エンドポイント
export const generateFoodCulture = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  handleGenerateFoodCulture
);
