import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import {
  Home as HomeIcon,
  RestaurantMenu as RestaurantMenuIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Fastfood as FastfoodIcon,
  Settings as SettingsIcon,
  MenuBook as MenuBookIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";
import "./App.css";
import DietaryRestrictions from "./pages/DietaryRestrictions";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetail from "./pages/MenuDetail";
import MenuScanner from "./pages/MenuScanner";
import Settings from "./pages/Settings";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    {
      text: "Dietary Restrictions",
      path: "/dietary-restrictions",
      icon: <RestaurantMenuIcon />,
    },
    {
      text: "Menu Scanner",
      path: "/menu-scanner",
      icon: <QrCodeScannerIcon />,
    },
    { text: "Menu", path: "/menu", icon: <FastfoodIcon /> },
    { text: "Menu Detail", path: "/menu-detail", icon: <MenuBookIcon /> },
    { text: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Japanese Food Guide
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Container maxWidth="lg">
          <Box sx={{ mt: 3, mb: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/dietary-restrictions"
                element={<DietaryRestrictions />}
              />
              <Route path="/menu-scanner" element={<MenuScanner />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu-detail" element={<MenuDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
