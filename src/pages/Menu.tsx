import React from "react";
import { Box, Typography, Container, Stack } from "@mui/material";
import Header from "../components/Header";
import MenuItem from "../components/MenuItem";
// Vite static asset import
import vegetableTempuraImg from "../assets/images/vegetable-tempura.png";

function Menu() {
  // デバッグ用: 画像パスを確認
  console.log("Vegetable Tempura Image Path:", vegetableTempuraImg);

  const menuItems = [
    {
      title: "Vegetable Tempura",
      ingredients: "Contains: Tofu, Vegetables",
      imageSrc: vegetableTempuraImg,
    },
    {
      title: "Chicken Teriyaki",
      ingredients: "Contains: Chicken, Soy Sauce, Sugar",
      imageSrc: "", // プレースホルダー画像なし
    },
    {
      title: "Salmon Sashimi",
      ingredients: "Contains: Raw Salmon, Wasabi",
      imageSrc: "", // プレースホルダー画像なし
    },
    {
      title: "Beef Ramen",
      ingredients: "Contains: Beef, Wheat Noodles, Egg",
      imageSrc: "", // プレースホルダー画像なし
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title="Menu" />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Stack spacing={3} alignItems="center">
          {/* ページタイトル */}
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
              Menu Items
            </Typography>
          </Box>

          {/* Menu Items List */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 390,
              backgroundColor: "#FFFFFF",
            }}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                title={item.title}
                ingredients={item.ingredients}
                imageSrc={item.imageSrc}
              />
            ))}
          </Box>

          {/* 説明テキスト */}
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 350, mt: 3 }}
          >
            各メニューアイテムをタップして詳細情報とアレルギー情報を確認できます。
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Menu;
