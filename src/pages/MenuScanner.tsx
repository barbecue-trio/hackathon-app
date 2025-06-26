import { Box, Typography } from "@mui/material"

import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Footer from "../components/Footer"
import Header from "../components/Header"

function MenuScanner() {
  const navigate = useNavigate()

  const handleCameraScan = () => {
    console.log("Scan with Camera clicked")
    // カメラスキャン機能を実装後、結果をMenu Analysisページに遷移
    navigate("/menu")
  }

  const handleUploadImage = () => {
    console.log("Upload Image clicked")
    // 画像アップロード機能を実装後、結果をMenu Analysisページに遷移
    navigate("/menu")
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
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default MenuScanner
