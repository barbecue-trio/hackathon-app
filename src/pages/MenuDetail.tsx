import { Box, Typography } from "@mui/material"

import ramanDishDetail from "../assets/images/ramen-dish-detail.png"
import ramanDishMain from "../assets/images/ramen-dish-main.png"
import DietaryItem from "../components/DietaryItem"
import Footer from "../components/Footer"
import Header from "../components/Header"

function MenuDetail() {
  const dietaryItems = [
    { label: "Vegan", isSelected: false },
    { label: "Halal", isSelected: false },
    { label: "Gluten-Free", isSelected: false },
    { label: "Kosher", isSelected: false },
    { label: "Vegetarian", isSelected: false },
  ]

  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Main Content Container */}
        <Box className="main-content with-footer scrollable">
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
                component="img"
                src={ramanDishMain}
                alt="Ramen dish"
                sx={{
                  width: "100%",
                  height: {
                    xs: "200px",
                    sm: "260px",
                  },
                  objectFit: "cover",
                  display: "block",
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
                  fontSize: "16px",
                  lineHeight: "1.5em",
                  textAlign: "left",
                  color: "#121217",
                  width: "100%",
                }}
              >
                A classic Japanese noodle soup with a rich broth, wheat noodles, and various
                toppings.
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
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
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
                  fontSize: "16px",
                  lineHeight: "1.5em",
                  textAlign: "left",
                  color: "#121217",
                  width: "100%",
                }}
              >
                Wheat noodles, pork broth, soy sauce, green onions, bamboo shoots, seaweed, and
                sliced pork.
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
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
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
                  fontSize: "16px",
                  lineHeight: "1.5em",
                  textAlign: "left",
                  color: "#121217",
                  width: "100%",
                }}
              >
                Contains wheat (gluten), soy, and may contain traces of shellfish.
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
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
                  lineHeight: "1.2777777777777777em",
                  textAlign: "left",
                  color: "#121217",
                  width: "100%",
                }}
              >
                Dietary Restrictions
              </Typography>
            </Box>

            {/* Dietary Items List */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0px 16px 12px",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "8px",
                  width: "100%",
                }}
              >
                {dietaryItems.map((item, index) => (
                  <DietaryItem
                    key={`${item.label}-${index}`}
                    label={item.label}
                    isSelected={item.isSelected}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Detail Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "stretch",
              alignItems: "stretch",
              padding: "12px 0px 24px",
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
                component="img"
                src={ramanDishDetail}
                alt="Ramen dish detail"
                sx={{
                  width: "100%",
                  height: {
                    xs: "160px",
                    sm: "200px",
                  },
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default MenuDetail
