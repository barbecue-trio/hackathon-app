import CheckIcon from "@mui/icons-material/Check"
import { Box, Typography } from "@mui/material"
import type React from "react"

interface DietaryItemProps {
  label: string
  isSelected?: boolean
  onClick?: () => void
}

const DietaryItem: React.FC<DietaryItemProps> = ({ label, isSelected = false, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        padding: "0px 16px",
        width: "390px",
        height: "56px",
        backgroundColor: "#FFFFFF",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              backgroundColor: "#F8F9FA",
            }
          : {},
      }}
    >
      {/* Left side - Text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
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
          {label}
        </Typography>
      </Box>

      {/* Right side - Icon */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "24px",
          height: "24px",
        }}
      >
        {isSelected && (
          <CheckIcon
            sx={{
              width: "24px",
              height: "24px",
              color: "#121217",
            }}
          />
        )}
      </Box>
    </Box>
  )
}

export default DietaryItem
