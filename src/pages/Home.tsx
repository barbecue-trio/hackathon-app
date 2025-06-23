import {
  QrCodeScanner as QrCodeScannerIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material"
import { Box, Button, Card, CardActions, CardContent, Container, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import "./Home.scss"

function Home() {
  const features = [
    {
      title: "食材制限設定",
      description: "アレルギーや宗教的な食事制限を設定して、安全に日本料理を楽しみましょう",
      icon: <RestaurantMenuIcon sx={{ fontSize: 40 }} />,
      link: "/dietary-restrictions",
      color: "#4caf50",
    },
    {
      title: "メニュースキャン",
      description: "日本語メニューをスキャンして、食材情報と食べ方を確認しましょう",
      icon: <QrCodeScannerIcon sx={{ fontSize: 40 }} />,
      link: "/menu-scanner",
      color: "#2196f3",
    },
    {
      title: "文化ガイド",
      description: "日本の食事マナーと文化的背景を学びましょう",
      icon: <TranslateIcon sx={{ fontSize: 40 }} />,
      link: "/menu",
      color: "#ff9800",
    },
    {
      title: "設定",
      description: "言語やその他の設定をカスタマイズしましょう",
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      link: "/settings",
      color: "#9c27b0",
    },
  ]

  return (
    <Container maxWidth="lg" className="home-container">
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom className="home-title">
          日本食ガイド
        </Typography>
        <Typography variant="h6" color="text.secondary" className="home-subtitle">
          外国人観光客のための日本料理体験アプリ
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="feature-card"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                component={Link}
                to={feature.link}
                variant="contained"
                sx={{
                  backgroundColor: feature.color,
                  "&:hover": {
                    backgroundColor: feature.color,
                    filter: "brightness(0.9)",
                  },
                }}
              >
                開始
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom className="welcome-message">
          日本の食文化へようこそ！
        </Typography>
        <Typography variant="body1" color="text.secondary">
          このアプリは、食事制限や文化的背景を考慮して、安全で楽しい日本料理体験をサポートします。
        </Typography>
      </Box>
    </Container>
  )
}

export default Home
