import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import MenuItem from "../components/MenuItem";
import CheckItem from "../components/CheckItem";
import Footer from "../components/Footer";
// Vite static asset import
import menuItemImg from "../assets/images/menu-item-image.png";

function Menu() {
  // Dietary Restrictions state
  const [dietaryRestrictions, setDietaryRestrictions] = useState<
    Record<string, boolean>
  >({
    Vegetarian: false,
    "No Pork": false,
  });

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        width: "100%",
        maxWidth: 390,
        margin: "0 auto",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        {/* Header */}
        <Header title="Menu Analysis" />

        {/* Dietary Restrictions Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 16px 12px",
            width: "100%",
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
          {Object.entries(dietaryRestrictions).map(([restriction, checked]) => (
            <CheckItem
              key={restriction}
              label={restriction}
              checked={checked}
              onChange={(newChecked) =>
                handleDietaryChange(restriction, newChecked)
              }
            />
          ))}
          {/* Additional Vegetarian item as shown in Figma */}
          <CheckItem label="Vegetarian" checked={false} onChange={() => {}} />
        </Box>

        {/* Menu Items Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 16px 12px",
            width: "100%",
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
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Menu;
