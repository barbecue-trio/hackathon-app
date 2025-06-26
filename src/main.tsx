import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "@fontsource/spline-sans/400.css"
import "@fontsource/spline-sans/700.css"
import "./index.css"
import App from "./App.tsx"

const theme = createTheme({
  palette: {
    primary: {
      main: "#4263FA", // Figma準拠
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#121217",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Spline Sans", "Roboto", system-ui, sans-serif',
    h1: {
      fontSize: "28px",
      fontWeight: 700,
      lineHeight: 1.25,
      "@media (max-width:425px)": {
        fontSize: "24px",
      },
    },
    h2: {
      fontSize: "22px",
      fontWeight: 700,
      lineHeight: 1.2727,
      "@media (max-width:425px)": {
        fontSize: "20px",
      },
    },
    h3: {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1.2778,
      "@media (max-width:425px)": {
        fontSize: "16px",
      },
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: "16px",
      fontWeight: 700,
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 425, // スマートフォンサイズ上限に合わせて変更
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  spacing: 4, // 4pxベースのスペーシング
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: "100%",
          overflowX: "hidden",
        },
        body: {
          height: "100%",
          overflowX: "hidden",
          "-webkit-tap-highlight-color": "transparent",
        },
        "#root": {
          height: "100%",
          overflowX: "hidden",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          textTransform: "none",
          fontWeight: 700,
          minHeight: "48px",
          "@media (pointer: coarse)": {
            minHeight: "48px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: "break-word",
        },
      },
    },
  },
})

const rootElement = document.getElementById("root")
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  )
}
