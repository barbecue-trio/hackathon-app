import { CameraAlt, Home, Settings } from "@mui/icons-material"
import { Box } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

const Footer = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const footerItems = [
    {
      icon: Home,
      path: "/",
      isActive: location.pathname === "/",
      label: "Home",
    },
    {
      icon: CameraAlt,
      path: "/menu-scanner",
      isActive: location.pathname === "/menu-scanner",
      label: "Scanner",
    },
    {
      icon: Settings,
      path: "/settings",
      isActive: location.pathname === "/settings",
      label: "Settings",
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "425px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #F2F2F5",
        zIndex: 1000,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Main container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px 12px",
          width: "100%",
        }}
      >
        {footerItems.map((item) => {
          const IconComponent = item.icon
          return (
            <Box
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                flex: 1,
                minHeight: "44px", // タッチターゲット
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(66, 99, 250, 0.1)",
                },
                "&:active": {
                  backgroundColor: "rgba(66, 99, 250, 0.2)",
                },
              }}
            >
              {/* Icon container */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "24px",
                  height: "24px",
                }}
              >
                <IconComponent
                  sx={{
                    fontSize: "24px",
                    color: item.isActive ? "#4263FA" : "rgba(18, 18, 23, 0.6)",
                    transition: "color 0.2s ease",
                  }}
                />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default Footer
