import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import activeIcon from "../assets/icons/footer-icon-active.svg";
import inactiveIcon from "../assets/icons/footer-icon-inactive.svg";
import inactiveIcon2 from "../assets/icons/footer-icon-inactive-2.svg";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const footerItems = [
    {
      icon: activeIcon, // ホームは常にホームアイコン（家の形）
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      icon: inactiveIcon, // メニュースキャナーは常にカメラアイコン
      path: "/menu-scanner",
      isActive: location.pathname === "/menu-scanner",
    },
    {
      icon: inactiveIcon2, // 設定は常に歯車アイコン
      path: "/settings",
      isActive: location.pathname === "/settings",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "390px",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #F2F2F5",
        zIndex: 1000,
      }}
    >
      {/* Main container - Depth 2, Frame 0 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "stretch",
          alignItems: "stretch",
          gap: "8px",
          padding: "8px 16px 12px",
          width: "100%",
        }}
      >
        {footerItems.map((item, index) => (
          <Box
            key={index}
            onClick={() => handleNavigation(item.path)}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "4px",
              flex: 1,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            {/* Icon container - height: 32px */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "stretch",
                alignItems: "stretch",
                height: "32px",
                width: "100%",
              }}
            >
              {/* Inner icon container - height: 24px */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.icon}
                  alt={`Footer icon ${index + 1}`}
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {/* Bottom spacer - Depth 2, Frame 1 */}
      <Box
        sx={{
          width: "100%",
          height: "20px",
          backgroundColor: "#FFFFFF",
        }}
      />
    </Box>
  );
};

export default Footer;
