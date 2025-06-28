import { onRequest } from "firebase-functions/v2/https";
import { handleGenerateCategories } from "../../handlers/categoryHandler";

// カテゴリー生成専用エンドポイント
export const generateCategories = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  handleGenerateCategories
);
