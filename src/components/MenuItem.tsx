import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  title: string;
  ingredients: string;
  imageSrc?: string;
}

function MenuItem({ title, ingredients, imageSrc }: MenuItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/menu-detail");
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2, // 16px gap as per Figma
        padding: "8px 16px",
        width: "100%",
        maxWidth: 390,
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#F8F9FA",
        },
      }}
    >
      {/* Image area - 56x56px */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1, // 8px border radius as per Figma
          backgroundColor: "#f5f5f5",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: "24px",
              color: "#ccc",
            }}
          >
            🍴
          </Typography>
        )}
      </Box>

      {/* Text content area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          minWidth: 0, // Allow text to wrap
        }}
      >
        {/* Main title */}
        <Typography
          sx={{
            fontFamily: '"Spline Sans", "Roboto", sans-serif',
            fontWeight: 500, // Medium weight as per Figma
            fontSize: 16,
            lineHeight: "1.5em",
            textAlign: "left",
            color: "#121217",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        {/* Ingredients/description */}
        <Typography
          sx={{
            fontFamily: '"Spline Sans", "Roboto", sans-serif',
            fontWeight: 400, // Regular weight as per Figma
            fontSize: 14,
            lineHeight: "1.5em",
            textAlign: "left",
            color: "#666B82",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {ingredients}
        </Typography>
      </Box>
    </Box>
  );
}

export default MenuItem;
