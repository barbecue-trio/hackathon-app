import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// Vite static asset import
import menuItemImg from "../assets/images/menu-item-image.png";
import CheckItem from "../components/CheckItem";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuItem from "../components/MenuItem";

interface LocationState {
  uploadedImage?: string;
  imagePath?: string;
  fileSize?: number;
  contentType?: string;
}

function Menu() {
  const location = useLocation();
  const state = location.state as LocationState;

  // Dietary Restrictions state
  const [dietaryRestrictions, setDietaryRestrictions] = useState<
    Record<string, boolean>
  >({
    Vegetarian: false,
    "No Pork": false,
  });

  // アップロードされた画像の情報をログ出力
  useEffect(() => {
    if (state?.uploadedImage) {
      console.log("アップロードされた画像URL:", state.uploadedImage);
      console.log("アップロードされた画像パス:", state.imagePath);
    }
  }, [state]);

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    setDietaryRestrictions((prev) => ({
      ...prev,
      [restriction]: checked,
    }));
  };

  const menuItems = [
    {
      title: "Vegetable Tempura",
      ingredients: "Contains: Tofu, Vegetables",
      imageSrc: menuItemImg,
    },
    {
      title: "Vegetable Tempura",
      ingredients: "Contains: Tofu, Vegetables",
      imageSrc: menuItemImg,
    },
    {
      title: "Vegetable Tempura",
      ingredients: "Contains: Tofu, Vegetables",
      imageSrc: menuItemImg,
    },
  ];

  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Main Content */}
        <Box className="main-content with-footer scrollable">
          {/* Header */}
          <Header title="Menu Analysis" />

          {/* アップロードされた画像が存在する場合の表示（デバッグ用） */}
          {state?.uploadedImage && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                margin: "0 16px 16px",
                borderRadius: "8px",
                border: "1px solid #e1e5e9",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#121217",
                  marginBottom: "8px",
                }}
              >
                アップロードされた画像：
              </Typography>
              <Box
                component="img"
                src={state.uploadedImage}
                alt="Uploaded menu"
                sx={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "8px",
                }}
              />

              {/* 画像詳細情報 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 12,
                    color: "#666",
                    wordBreak: "break-all",
                  }}
                >
                  <strong>パス:</strong> {state.imagePath}
                </Typography>

                {state.fileSize && (
                  <Typography
                    sx={{
                      fontFamily: '"Spline Sans", "Roboto", sans-serif',
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    <strong>ファイルサイズ:</strong>{" "}
                    {(state.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                )}

                {state.contentType && (
                  <Typography
                    sx={{
                      fontFamily: '"Spline Sans", "Roboto", sans-serif',
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    <strong>ファイル形式:</strong> {state.contentType}
                  </Typography>
                )}

                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 11,
                    color: "#999",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  ※ この画像がOCRとAI解析の対象となります
                </Typography>
              </Box>
            </Box>
          )}

          {/* Dietary Restrictions Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 12px",
                sm: "20px 16px 12px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "20px",
                  sm: "22px",
                },
                lineHeight: "1.2727272727272727em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Dietary Restrictions
            </Typography>
          </Box>

          {/* Dietary Restrictions Check Items */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 16px",
              width: "100%",
            }}
          >
            {Object.entries(dietaryRestrictions).map(
              ([restriction, checked]) => (
                <CheckItem
                  key={restriction}
                  label={restriction}
                  checked={checked}
                  onChange={(newChecked) =>
                    handleDietaryChange(restriction, newChecked)
                  }
                />
              )
            )}
            {/* Additional Vegetarian item as shown in Figma */}
            <CheckItem label="Vegetarian" checked={false} onChange={() => {}} />
          </Box>

          {/* Menu Items Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 12px",
                sm: "20px 16px 12px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "20px",
                  sm: "22px",
                },
                lineHeight: "1.2727272727272727em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Menu Items
            </Typography>
          </Box>

          {/* Menu Items List */}
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
            }}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={`${item.title}-${index}`}
                title={item.title}
                ingredients={item.ingredients}
                imageSrc={item.imageSrc}
              />
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

export default Menu;
