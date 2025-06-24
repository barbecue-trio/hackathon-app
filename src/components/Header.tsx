import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backArrowIcon from "../assets/icons/back-arrow.svg";

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header = ({ title, onBack }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // デフォルトで前のページに戻る
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "390px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 16px 8px",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {/* Left side - Back button container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "48px",
          height: "48px",
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            width: "24px",
            height: "24px",
            padding: 0,
            minWidth: "24px",
            "& img": {
              width: "24px",
              height: "24px",
            },
          }}
        >
          <img src={backArrowIcon} alt="Back" />
        </IconButton>
      </Box>

      {/* Right side - Title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px 48px 0px 0px",
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Spline Sans, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "1.2777777777777777em",
            textAlign: "center",
            color: "#121217",
            width: "100%",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
