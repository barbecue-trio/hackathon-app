import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/dietary-restrictions");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "390px",
        height: "844px",
        backgroundColor: "#FFFFFF",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Main content area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Eyecatch Image */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            alignItems: "stretch",
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "stretch",
              alignItems: "stretch",
              flex: 1,
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
              }}
            />
          </Box>
        </Box>

        {/* Title Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 16px 12px",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Spline Sans", "Roboto", sans-serif',
              fontWeight: 700,
              fontSize: "28px",
              lineHeight: "1.25em",
              textAlign: "center",
              color: "#121217",
              width: "100%",
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
            }}
          >
            Enjoy meals at restaurants in Japan with ease. Register, log in, or
            use the app as a guest.
          </Typography>
        </Box>

        {/* Button Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "stretch",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "12px 16px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Button
              variant="primary"
              onClick={handleRegister}
              sx={{
                width: "100%",
                maxWidth: "358px",
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Home;
