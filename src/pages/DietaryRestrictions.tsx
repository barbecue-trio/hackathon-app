import { allergyList } from "@/data/allergens"
import { religiousRestrictionList } from "@/data/religiousRestrictions"
import { getInitDietaryRestrictions } from "@/services/dietaryRestrictionService"
import type { AllergenId, ReligiousRestrictionId } from "@/types"
import { saveDietaryRestrictions } from "@/utils/localStorage"
import { Box, Typography } from "@mui/material"
import { useState } from "react"
import Button from "../components/Button"
import CheckItem from "../components/CheckItem"
import Footer from "../components/Footer"
import Header from "../components/Header"

function DietaryRestrictions() {
  const [allergies, setAllergies] = useState<Record<AllergenId, boolean>>(
    () => getInitDietaryRestrictions().allergies
  )

  const [religiousRestrictions, setReligiousRestrictions] = useState<
    Record<ReligiousRestrictionId, boolean>
  >(() => getInitDietaryRestrictions().religious)

  const [otherRestrictions, setOtherRestrictions] = useState<Record<string, boolean>>({
    Vegan: false,
    "Gluten-free": false,
    "Low-carb": false,
  })

  const handleAllergyChange = (id: AllergenId) => {
    setAllergies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleReligiousChange = (id: ReligiousRestrictionId) => {
    setReligiousRestrictions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOtherChange = (restriction: string, checked: boolean) => {
    setOtherRestrictions((prev) => ({
      ...prev,
      [restriction]: checked,
    }))
  }

  const handleSave = () => {
    saveDietaryRestrictions({
      allergies: Object.entries(allergies)
        .filter(([_, checked]) => checked)
        .map(([id]) => Number(id)) as AllergenId[],
      religious: Object.entries(religiousRestrictions)
        .filter(([_, checked]) => checked)
        .map(([id]) => Number(id)) as ReligiousRestrictionId[],
      other: Object.keys(otherRestrictions).filter((key) => otherRestrictions[key]),
    })
  }

  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Header */}
        <Header title="Dietary Restrictions" />

        {/* Main Content */}
        <Box className="main-content with-footer dietary-restrictions scrollable">
          {/* Allergies Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 8px", // 320px-424px
                sm: "20px 20px 12px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "18px 18px 10px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "19px 19px 11px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "18px", // 320px-424px
                  sm: "20px", // 425px以上
                },
                // 段階的調整
                "@media (min-width: 375px) and (max-width: 390px)": {
                  fontSize: "18.5px",
                },
                "@media (min-width: 391px) and (max-width: 425px)": {
                  fontSize: "19px",
                },
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
              padding: {
                xs: "0px 16px", // 320px-424px
                sm: "0px 20px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "0px 18px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "0px 19px",
              },
              width: "100%",
            }}
          >
            {allergyList.map((allergen) => (
              <CheckItem
                key={allergen.id}
                label={allergen.name}
                checked={allergies[allergen.id] || false}
                onChange={() => handleAllergyChange(allergen.id)}
              />
            ))}
          </Box>

          {/* Religious Restrictions Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 8px", // 320px-424px
                sm: "20px 20px 12px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "18px 18px 10px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "19px 19px 11px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "18px", // 320px-424px
                  sm: "20px", // 425px以上
                },
                // 段階的調整
                "@media (min-width: 375px) and (max-width: 390px)": {
                  fontSize: "18.5px",
                },
                "@media (min-width: 391px) and (max-width: 425px)": {
                  fontSize: "19px",
                },
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
              padding: {
                xs: "0px 16px", // 320px-424px
                sm: "0px 20px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "0px 18px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "0px 19px",
              },
              width: "100%",
            }}
          >
            {religiousRestrictionList.map((restriction) => (
              <CheckItem
                key={restriction.id}
                label={restriction.name}
                checked={religiousRestrictions[restriction.id] || false}
                onChange={() => handleReligiousChange(restriction.id)}
              />
            ))}
          </Box>

          {/* Other Restrictions Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 8px", // 320px-424px
                sm: "20px 20px 12px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "18px 18px 10px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "19px 19px 11px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "18px", // 320px-424px
                  sm: "20px", // 425px以上
                },
                // 段階的調整
                "@media (min-width: 375px) and (max-width: 390px)": {
                  fontSize: "18.5px",
                },
                "@media (min-width: 391px) and (max-width: 425px)": {
                  fontSize: "19px",
                },
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
              padding: {
                xs: "0px 16px", // 320px-424px
                sm: "0px 20px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "0px 18px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "0px 19px",
              },
              width: "100%",
            }}
          >
            {Object.entries(otherRestrictions).map(([restriction, checked]) => (
              <CheckItem
                key={restriction}
                label={restriction}
                checked={checked}
                onChange={(newChecked) => handleOtherChange(restriction, newChecked)}
              />
            ))}
          </Box>

          {/* Save Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: {
                xs: "24px 16px 32px", // 320px-424px (下部余白を増加)
                sm: "28px 20px 36px", // 425px以上
              },
              // 段階的調整
              "@media (min-width: 375px) and (max-width: 390px)": {
                padding: "26px 18px 34px",
              },
              "@media (min-width: 391px) and (max-width: 425px)": {
                padding: "27px 19px 35px",
              },
              width: "100%",
            }}
          >
            <Button
              variant="primary"
              onClick={handleSave}
              sx={{
                backgroundColor: "#4263FA",
                color: "#FFFFFF",
                width: "100%",
                maxWidth: {
                  xs: "358px", // 320px-424px
                  sm: "380px", // 425px以上
                },
                "&:hover": {
                  backgroundColor: "#3651E6",
                },
                "&:active": {
                  backgroundColor: "#2A41D0",
                },
              }}
            >
              Save Preferences
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default DietaryRestrictions
