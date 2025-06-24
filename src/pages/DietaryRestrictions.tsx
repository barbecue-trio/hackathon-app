import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import CheckItem from "../components/CheckItem";
import Button from "../components/Button";
import Footer from "../components/Footer";

function DietaryRestrictions() {
  const [allergies, setAllergies] = useState<Record<string, boolean>>({
    "Crustacean Shellfish": false,
    "Molluscan shellfish": false,
    Fish: false,
    Wheat: false,
    Eggs: false,
    Milk: false,
    Peanuts: false,
    "Tree nuts": false,
    Soybeans: false,
    Sesame: false,
  });

  const [religiousRestrictions, setReligiousRestrictions] = useState<
    Record<string, boolean>
  >({
    Halal: false,
    Kosher: false,
    Vegetarian: false,
  });

  const [otherRestrictions, setOtherRestrictions] = useState<
    Record<string, boolean>
  >({
    Vegan: false,
    "Gluten-free": false,
    "Low-carb": false,
  });

  const handleAllergyChange = (allergen: string, checked: boolean) => {
    setAllergies((prev) => ({
      ...prev,
      [allergen]: checked,
    }));
  };

  const handleReligiousChange = (restriction: string, checked: boolean) => {
    setReligiousRestrictions((prev) => ({
      ...prev,
      [restriction]: checked,
    }));
  };

  const handleOtherChange = (restriction: string, checked: boolean) => {
    setOtherRestrictions((prev) => ({
      ...prev,
      [restriction]: checked,
    }));
  };

  const handleSave = () => {
    // TODO: Save dietary restrictions
    console.log("Allergies:", allergies);
    console.log("Religious Restrictions:", religiousRestrictions);
    console.log("Other Restrictions:", otherRestrictions);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "390px",
          margin: "0 auto",
          paddingBottom: "80px", // Footer用のスペース確保
        }}
      >
        {/* Header */}
        <Header title="Dietary Restrictions" />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "100%",
          }}
        >
          {/* Allergies Section */}
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
                fontSize: "18px",
                lineHeight: "1.2777777777777777em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Allergies
            </Typography>
          </Box>

          {/* Allergies List */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 16px",
              width: "100%",
            }}
          >
            {Object.entries(allergies).map(([allergen, checked]) => (
              <CheckItem
                key={allergen}
                label={allergen}
                checked={checked}
                onChange={(newChecked) =>
                  handleAllergyChange(allergen, newChecked)
                }
              />
            ))}
          </Box>

          {/* Religious Restrictions Section */}
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
                fontSize: "18px",
                lineHeight: "1.2777777777777777em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Religious Restrictions
            </Typography>
          </Box>

          {/* Religious Restrictions List */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 16px",
              width: "100%",
            }}
          >
            {Object.entries(religiousRestrictions).map(
              ([restriction, checked]) => (
                <CheckItem
                  key={restriction}
                  label={restriction}
                  checked={checked}
                  onChange={(newChecked) =>
                    handleReligiousChange(restriction, newChecked)
                  }
                />
              )
            )}
          </Box>

          {/* Other Restrictions Section */}
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
                fontSize: "18px",
                lineHeight: "1.2777777777777777em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Other Restrictions
            </Typography>
          </Box>

          {/* Other Restrictions List */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 16px",
              width: "100%",
            }}
          >
            {Object.entries(otherRestrictions).map(([restriction, checked]) => (
              <CheckItem
                key={restriction}
                label={restriction}
                checked={checked}
                onChange={(newChecked) =>
                  handleOtherChange(restriction, newChecked)
                }
              />
            ))}
          </Box>

          {/* Save Button Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "12px 16px",
              width: "100%",
            }}
          >
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>

          {/* Spacer */}
          <Box
            sx={{
              height: "20px",
              width: "100%",
            }}
          />
        </Box>
      </Box>

      {/* Footer - 固定配置 */}
      <Footer />
    </>
  );
}

export default DietaryRestrictions;
