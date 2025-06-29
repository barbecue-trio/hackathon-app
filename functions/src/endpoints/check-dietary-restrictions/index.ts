import { onRequest } from "firebase-functions/v2/https"
import { handleCheckDietaryRestrictions } from "../../handlers/dietaryRestrictionHandler"

// 食事制限チェック専用エンドポイント
export const checkDietaryRestrictions = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    memory: "512MiB",
  },
  handleCheckDietaryRestrictions
)
