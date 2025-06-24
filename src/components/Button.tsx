import React from "react";
import { Button as MuiButton, type ButtonProps } from "@mui/material";

interface CustomButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?: "primary" | "secondary" | "text";
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = "primary",
  children,
  sx,
  ...props
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#E8EDFA",
          color: "#121217",
          fontFamily: '"Spline Sans", "Roboto", sans-serif',
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "1.5em",
          textAlign: "center" as const,
          textTransform: "none" as const,
          width: "358px",
          height: "48px",
          borderRadius: "24px",
          padding: "0 20px",
          border: "none",
          "&:hover": {
            backgroundColor: "#D6DFEF",
          },
          "&:active": {
            backgroundColor: "#C4D1E4",
          },
          "&:focus": {
            outline: "2px solid #4263FA",
            outlineOffset: "2px",
          },
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          color: "#4263FA",
          border: "2px solid #4263FA",
          fontFamily: '"Spline Sans", "Roboto", sans-serif',
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "1.5em",
          textAlign: "center" as const,
          textTransform: "none" as const,
          width: "358px",
          height: "48px",
          borderRadius: "24px",
          padding: "0 20px",
          "&:hover": {
            backgroundColor: "#F0F4FF",
          },
        };
      case "text":
        return {
          backgroundColor: "transparent",
          color: "#121217",
          border: "none",
          fontFamily: '"Spline Sans", "Roboto", sans-serif',
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "1.5em",
          textAlign: "center" as const,
          textTransform: "none" as const,
          "&:hover": {
            backgroundColor: "#F5F5F5",
          },
        };
      default:
        return {};
    }
  };

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
  );
};

export default Button;
