import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import NavigationMenu from "../components/NavigationMenu";
import Footer from "../components/Footer";

function Settings() {
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const handleLanguageClick = () => {
    // 言語選択のロジック（将来的にはダイアログを表示）
    const languages = ["English", "日本語", "Español", "Français", "Deutsch"];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "390px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          paddingBottom: "80px", // Footer用のスペース確保
        }}
      >
        <Header title="Settings" />

        <Box sx={{ padding: "16px 0" }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Spline Sans, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              color: "#121217",
              padding: "0 16px 16px",
            }}
          >
            Language Settings
          </Typography>

          <NavigationMenu
            language={currentLanguage}
            onClick={handleLanguageClick}
          />
        </Box>
      </Box>

      {/* Footer - 固定配置 */}
      <Footer />
    </>
  );
}

export default Settings;
