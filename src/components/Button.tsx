import { type ButtonProps, Button as MuiButton } from "@mui/material"
import type React from "react"

interface CustomButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?: "primary" | "secondary" | "text"
  children: React.ReactNode
}

const Button: React.FC<CustomButtonProps> = ({ variant = "primary", children, sx, ...props }) => {
  const getButtonStyles = () => {
    const baseStyles = {
      fontFamily: '"Spline Sans", "Roboto", sans-serif',
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "1.5em",
      textAlign: "center" as const,
      textTransform: "none" as const,
      width: "100%",
      maxWidth: "390px",
      minHeight: "48px",
      borderRadius: "24px",
      padding: "12px 20px",
      border: "none",
      transition: "all 0.2s ease",
      "&:focus": {
        outline: "2px solid #4263FA",
        outlineOffset: "2px",
      },
      "@media (pointer: coarse)": {
        minHeight: "48px",
      },
      "@media (min-width: 391px)": {
        maxWidth: "390px",
        margin: "0 auto",
      },
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          backgroundColor: "#E8EDFA",
          color: "#121217",
          "&:hover": {
            backgroundColor: "#D6DFEF",
            transform: "translateY(-1px)",
          },
          "&:active": {
            backgroundColor: "#C4D1E4",
            transform: "translateY(0)",
          },
        }
      case "secondary":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: "#4263FA",
          border: "2px solid #4263FA",
          "&:hover": {
            backgroundColor: "#F0F4FF",
            transform: "translateY(-1px)",
          },
          "&:active": {
            backgroundColor: "#E8EDFA",
            transform: "translateY(0)",
          },
        }
      case "text":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: "#121217",
          border: "none",
          fontWeight: 400,
          "&:hover": {
            backgroundColor: "#F5F5F5",
          },
          "&:active": {
            backgroundColor: "#EEEEEE",
          },
        }
      default:
        return baseStyles
    }
  }

  return (
    <MuiButton
      {...props}
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  )
}

export default Button
