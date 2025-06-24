import { Box, Typography } from "@mui/material";
import navigationArrowIcon from "../assets/icons/navigation-menu-arrow.svg";

interface NavigationMenuProps {
  language?: string;
  onClick?: () => void;
}

const NavigationMenu = ({
  language = "English",
  onClick,
}: NavigationMenuProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        padding: "8px 16px 0px",
        backgroundColor: "#FFFFFF",
        width: "100%",
        maxWidth: "390px",
        height: "72px",
        boxSizing: "border-box",
        margin: "0 auto",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              backgroundColor: "#F8F9FA",
            }
          : {},
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Left side - Language Settings */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "fit-content",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Spline Sans, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "1.5em",
              textAlign: "left",
              color: "#121217",
            }}
          >
            App Language
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "105px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Spline Sans, sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "1.5em",
              textAlign: "left",
              color: "#5E668C",
            }}
          >
            {language}
          </Typography>
        </Box>
      </Box>

      {/* Right side - Icon */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          alignItems: "stretch",
          width: "fit-content",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "24px",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "24px",
              height: "24px",
              position: "relative",
            }}
          >
            <img
              src={navigationArrowIcon}
              alt="Navigation arrow"
              width="24"
              height="24"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NavigationMenu;
