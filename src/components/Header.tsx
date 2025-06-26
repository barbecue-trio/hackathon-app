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
        position: "fixed", // sticky → fixed に変更
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "425px", // 425px対応
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: {
          xs: "12px 16px 8px", // 320px-424px
          sm: "16px 20px 10px", // 425px以上
        },
        paddingTop: {
          xs: "calc(env(safe-area-inset-top, 0px) + 12px)",
          sm: "calc(env(safe-area-inset-top, 0px) + 16px)",
        },
        boxSizing: "border-box",
        zIndex: 1100, // Footerの1000より高く設定
        borderBottom: "1px solid #f0f0f0",
        // 425px範囲内での段階的調整
        "@media (min-width: 375px) and (max-width: 390px)": {
          padding: "14px 18px 9px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
        },
        "@media (min-width: 391px) and (max-width: 425px)": {
          padding: "15px 20px 10px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 15px)",
        },
      }}
    >
      {/* Left side - Back button container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          minWidth: {
            xs: "44px", // 小型スマホ
            sm: "48px", // 425px以上
          },
          height: {
            xs: "44px",
            sm: "48px",
          },
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            width: {
              xs: "44px",
              sm: "48px",
            },
            height: {
              xs: "44px",
              sm: "48px",
            },
            padding: {
              xs: "10px",
              sm: "12px",
            },
            minWidth: {
              xs: "44px",
              sm: "48px",
            },
            borderRadius: "8px",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(66, 99, 250, 0.1)",
            },
            "&:active": {
              backgroundColor: "rgba(66, 99, 250, 0.2)",
            },
            "& img": {
              width: {
                xs: "24px",
                sm: "26px",
              },
              height: {
                xs: "24px",
                sm: "26px",
              },
            },
          }}
        >
          <img src={backArrowIcon} alt="Back" />
        </IconButton>
      </Box>

      {/* Center - Title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          paddingLeft: {
            xs: "8px",
            sm: "12px",
          },
          paddingRight: {
            xs: "44px", // バランスを取るために右側の余白を確保
            sm: "48px",
          },
          minWidth: 0, // Flexboxのオーバーフロー対策
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Spline Sans", "Roboto", sans-serif',
            fontWeight: 700,
            fontSize: {
              xs: "16px", // 320px-424px
              sm: "18px", // 425px以上
            },
            // 425px範囲内での段階的調整
            "@media (min-width: 375px) and (max-width: 390px)": {
              fontSize: "16.5px",
            },
            "@media (min-width: 391px) and (max-width: 425px)": {
              fontSize: "17px",
            },
            lineHeight: "1.2777777777777777em",
            textAlign: "center",
            color: "#121217",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
