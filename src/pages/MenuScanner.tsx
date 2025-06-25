import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

function MenuScanner() {
  const navigate = useNavigate();

  const handleCameraScan = () => {
    console.log("Scan with Camera clicked");
    // カメラスキャン機能を実装後、結果をMenu Analysisページに遷移
    navigate("/menu");
  };

  const handleUploadImage = () => {
    console.log("Upload Image clicked");
    // 画像アップロード機能を実装後、結果をMenu Analysisページに遷移
    navigate("/menu");
  };

  return (
    <>
      {/* Main Frame - 390x844 with space-between layout */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 390,
          height: "100vh",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          margin: "0 auto",
        }}
      >
        {/* Content Area - Column layout with hug content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
            flex: "0 0 auto",
          }}
        >
          {/* Header Component */}
          <Header title="Menu Scanner" />

          {/* Text Content Frame - Center aligned with padding */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "stretch",
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
              }}
            >
              Scan the menu with your camera or upload an image
            </Typography>
          </Box>

          {/* Buttons Container - Stretch layout */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "stretch",
              alignItems: "stretch",
              alignSelf: "stretch",
            }}
          >
            {/* Inner Buttons Frame - Column with gap and padding */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "12px 16px",
                flex: 1,
              }}
            >
              {/* Primary Button - Scan with Camera */}
              <Button
                variant="primary"
                sx={{
                  backgroundColor: "#4263FA",
                  color: "#FFFFFF",
                  width: "358px",
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
                  width: "358px",
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
        </Box>

        {/* Footer - Fixed at bottom */}
        <Footer />
      </Box>
    </>
  );
}

export default MenuScanner;
