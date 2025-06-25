import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DietaryItem from "../components/DietaryItem";
import ramanDishMain from "../assets/images/ramen-dish-main.png";
import ramanDishDetail from "../assets/images/ramen-dish-detail.png";

function MenuDetail() {
  const dietaryItems = [
    { label: "Vegan", isSelected: false },
    { label: "Halal", isSelected: false },
    { label: "Gluten-Free", isSelected: false },
    { label: "Kosher", isSelected: false },
    { label: "Vegetarian", isSelected: false },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 390,
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        margin: "0 auto",
      }}
    >
      {/* Main Content Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        {/* Header */}
        <Header title="Dish Details" />

        {/* Main Dish Image */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "stretch",
            alignItems: "stretch",
            padding: "12px 0px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "stretch",
              alignItems: "stretch",
              gap: "4px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "260px",
                backgroundImage: `url(${ramanDishMain})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Box>
        </Box>

        {/* Main Block - Title and Description */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* Title */}
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
              Ramen
            </Typography>
          </Box>

          {/* Description */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "4px 16px 12px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "1.5em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              A classic Japanese noodle soup with a rich broth, wheat noodles,
              and various toppings.
            </Typography>
          </Box>
        </Box>

        {/* Ingredients Block */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* Ingredients Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "16px 16px 8px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "1.2777777777777777em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Ingredients
            </Typography>
          </Box>

          {/* Ingredients Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "4px 16px 12px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "1.5em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Wheat noodles, pork broth, soy sauce, green onions, bamboo shoots,
              seaweed, and sliced pork.
            </Typography>
          </Box>
        </Box>

        {/* Allergens Block */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* Allergens Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "16px 16px 8px",
              width: "390px",
              height: "48px",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "1.2777777777777777em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Allergens
            </Typography>
          </Box>

          {/* Allergens Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "4px 16px 12px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "1.5em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Contains wheat, soy, and pork. May contain traces of shellfish and
              nuts due to shared kitchen equipment.
            </Typography>
          </Box>
        </Box>

        {/* Dietary Restrictions Block */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* Dietary Restrictions Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "16px 16px 8px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "1.2777777777777777em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Dietary Restrictions
            </Typography>
          </Box>

          {/* Dietary Items */}
          {dietaryItems.map((item, index) => (
            <DietaryItem
              key={index}
              label={item.label}
              isSelected={item.isSelected}
            />
          ))}
        </Box>

        {/* Four Tile Image */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "stretch",
            alignItems: "stretch",
            padding: "12px 0px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "stretch",
              alignItems: "stretch",
              gap: "4px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "200px",
                backgroundImage: `url(${ramanDishDetail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default MenuDetail;
