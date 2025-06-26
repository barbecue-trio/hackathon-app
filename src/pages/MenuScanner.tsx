import { Box, Typography } from "@mui/material"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Footer from "../components/Footer"
import Header from "../components/Header"

function MenuScanner() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCameraScan = async () => {
    console.log("Scan with Camera clicked")
    try {
      // カメラアクセスを要求
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // 背面カメラを優先
        },
      })

      // カメラストリームが取得できた場合
      if (stream) {
        console.log("Camera access granted")
        // TODO: カメラプレビューの表示とキャプチャ機能を実装
        // 現在は一旦ストリームを停止
        for (const track of stream.getTracks()) {
          track.stop()
        }

        // Menu Analysisページに遷移（仮の実装）
        navigate("/menu")
      }
    } catch (error) {
      console.error("Camera access denied or not available:", error)
      alert("カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。")
    }
  }

  const handleUploadImage = () => {
    console.log("Upload Image clicked")
    // ファイル選択ダイアログを開く
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File selected:", file.name)
      // 画像ファイルかどうかをチェック
      if (file.type.startsWith("image/")) {
        console.log("Valid image file selected")
        // TODO: 画像解析処理を実装
        // Menu Analysisページに遷移
        navigate("/menu")
      } else {
        alert("画像ファイルを選択してください。")
      }
    }
  }

  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Content Area */}
        <Box className="main-content with-footer">
          {/* Header Component */}
          <Header title="Menu Scanner" />

          {/* Text Content Frame */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 16px 12px",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "1.5em",
                textAlign: "center",
                color: "#121217",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              Scan the menu with your camera or upload an image
            </Typography>
          </Box>

          {/* Buttons Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "12px 16px",
              alignItems: "center",
            }}
          >
            {/* Primary Button - Scan with Camera */}
            <Button
              variant="primary"
              sx={{
                backgroundColor: "#4263FA",
                color: "#FFFFFF",
                width: "100%",
                maxWidth: "358px",
                height: "48px",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: "#3651E6",
                },
                "&:active": {
                  backgroundColor: "#2A41D0",
                },
              }}
              onClick={handleCameraScan}
            >
              Scan with Camera
            </Button>

            {/* Secondary Button - Upload Image */}
            <Button
              variant="secondary"
              sx={{
                backgroundColor: "#E8EDFA",
                color: "#121217",
                width: "100%",
                maxWidth: "358px",
                height: "48px",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: "#D6E1F7",
                },
                "&:active": {
                  backgroundColor: "#C4D5F4",
                },
              }}
              onClick={handleUploadImage}
            >
              Upload Image
            </Button>
          </Box>

          {/* Hidden file input for image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default MenuScanner
