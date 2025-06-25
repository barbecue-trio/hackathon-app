import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import NavigationMenu from "../components/NavigationMenu";
import Footer from "../components/Footer";

function Settings() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "390px",
        height: "844px",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Main content container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          flex: 1,
        }}
      >
        {/* Header */}
        <Header title="Settings" />

        {/* Preferences Block */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
            gap: "10px",
          }}
        >
          {/* Preferences Section Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
              padding: "20px 16px 12px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Spline Sans, sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                lineHeight: "1.2727272727272727em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Preferences
            </Typography>
          </Box>

          {/* App Language Navigation Menu */}
          <NavigationMenu
            title="App Language"
            value="English"
            showArrow={true}
          />

          {/* Currency Navigation Menu */}
          <NavigationMenu
            title="Currency"
            value="Japanese Yes"
            showArrow={true}
          />
        </Box>

        {/* Account Block */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
            gap: "10px",
            padding: "10px",
          }}
        >
          {/* Account Section Title */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
              padding: "20px 16px 12px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Spline Sans, sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                lineHeight: "1.2727272727272727em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Account
            </Typography>
          </Box>

          {/* Manage Account Navigation Menu */}
          <NavigationMenu title="Manage Account" showArrow={true} />
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Settings;
