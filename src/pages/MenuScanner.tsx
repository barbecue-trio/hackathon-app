import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Button as MuiButton,
  IconButton,
} from "@mui/material";
import { CameraAlt, PhotoLibrary, Upload } from "@mui/icons-material";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

function MenuScanner() {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "80px", // Footer用のスペース確保
        }}
      >
        <Header title="Menu Scanner" />

        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Stack spacing={4} alignItems="center">
            {/* Head1コンポーネント - Figmaデザインに基づく実装 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "20px 16px 12px",
                width: "100%",
                maxWidth: 390,
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  lineHeight: "1.2727272727272727em",
                  textAlign: "left",
                  color: "#121217",
                  width: "100%",
                }}
              >
                Ramen
              </Typography>
            </Box>

            {/* Figmaデザインに基づくText Box */}
            <Card
              sx={{
                width: "100%",
                maxWidth: 390,
                backgroundColor: "#f8f9fa",
                boxShadow: 2,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "4px 16px 12px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "1.5em",
                    textAlign: "center",
                    color: "#121217",
                    width: "100%",
                  }}
                >
                  Scan the menu with your camera or upload an image
                </Typography>
              </CardContent>
            </Card>

            {/* Figma Primary Color Button - Scan with Camera */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 390,
                display: "flex",
                justifyContent: "center",
                padding: "0 16px",
              }}
            >
              <Button
                variant="primary"
                sx={{
                  backgroundColor: "#4263FA",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#3651E6",
                  },
                  "&:active": {
                    backgroundColor: "#2A41D0",
                  },
                }}
                onClick={() => {
                  // カメラ機能の実装予定
                  console.log("Scan with Camera clicked");
                }}
              >
                Scan with Camera
              </Button>
            </Box>

            {/* ギャラリーとアップロード機能のボタン */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                width: "100%",
                maxWidth: 390,
                justifyContent: "center",
              }}
            >
              <Button
                variant="secondary"
                sx={{
                  flex: 1,
                  py: 2,
                  borderRadius: 2,
                  width: "auto",
                }}
              >
                📷 ギャラリーから選択
              </Button>
            </Stack>

            {/* 追加のアップロードボタン */}
            <Box sx={{ width: "100%", maxWidth: 390 }}>
              <Button
                variant="text"
                sx={{
                  width: "100%",
                  py: 2,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#eeeeee",
                  },
                }}
              >
                ファイルをアップロード
              </Button>
            </Box>

            {/* ヘルプテキスト */}
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 350 }}
            >
              メニューの写真を撮影またはアップロードして、食材情報を自動解析します。
              アレルギーや宗教的制約に基づいて安全性をチェックできます。
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Footer - 固定配置 */}
      <Footer />
    </>
  );
}

export default MenuScanner;
