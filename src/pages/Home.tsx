import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Footer from "../components/Footer"

function Home() {
  const navigate = useNavigate()

  const handleRegister = () => {
    navigate("/dietary-restrictions")
  }
  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Main content area */}
        <Box className="main-content with-footer">
          {/* Eyecatch Image */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "stretch",
              alignItems: "stretch",
              flex: 1,
              minHeight: {
                xs: "40vh",
                sm: "50vh",
              },
            }}
          >
            <Box
              sx={{
                backgroundImage: "url(/home-eyecatch.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#FFFFFF",
                flex: 1,
                width: "100%",
                minHeight: "inherit",
              }}
            />
          </Box>

          {/* Title Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: {
                xs: "16px 16px 12px",
                sm: "20px 20px 12px",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "24px",
                  sm: "28px",
                },
                lineHeight: "1.25em",
                textAlign: "center",
                color: "#121217",
                width: "100%",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              Menu Scanner for International Visitors
            </Typography>
          </Box>

          {/* Description Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 16px 12px",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "1.5em",
                textAlign: "center",
                color: "#121217",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              Enjoy meals at restaurants in Japan with ease. Register, log in, or use the app as a
              guest.
            </Typography>
          </Box>

          {/* Button Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              padding: "12px 16px",
            }}
          >
            <Button
              variant="primary"
              onClick={handleRegister}
              sx={{
                width: "100%",
                maxWidth: "358px",
                minHeight: "48px",
              }}
            >
              Register
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default Home
