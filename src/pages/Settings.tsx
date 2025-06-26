import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import NavigationMenu from "../components/NavigationMenu";
import Footer from "../components/Footer";

function Settings() {
  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Header */}
        <Header title="Settings" />

        {/* Main content container */}
        <Box className="main-content with-footer scrollable">
          {/* Preferences Block */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "10px",
            }}
          >
            {/* Preferences Section Title */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: {
                  xs: "16px 16px 12px",
                  sm: "20px 16px 12px",
                },
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: "20px",
                    sm: "22px",
                  },
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
              value="Japanese Yen"
              showArrow={true}
            />
          </Box>

          {/* Account Block */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "10px",
              padding: "10px 0",
            }}
          >
            {/* Account Section Title */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: {
                  xs: "16px 16px 12px",
                  sm: "20px 16px 12px",
                },
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: "20px",
                    sm: "22px",
                  },
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

          {/* Help & Support Block */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "10px",
              padding: "10px 0",
            }}
          >
            {/* Help Section Title */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: {
                  xs: "16px 16px 12px",
                  sm: "20px 16px 12px",
                },
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: "20px",
                    sm: "22px",
                  },
                  lineHeight: "1.2727272727272727em",
                  textAlign: "left",
                  color: "#121217",
                  width: "100%",
                }}
              >
                Help & Support
              </Typography>
            </Box>

            {/* Help Center Navigation Menu */}
            <NavigationMenu title="Help Center" showArrow={true} />

            {/* Contact Us Navigation Menu */}
            <NavigationMenu title="Contact Us" showArrow={true} />

            {/* Privacy Policy Navigation Menu */}
            <NavigationMenu title="Privacy Policy" showArrow={true} />
          </Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

export default Settings;
