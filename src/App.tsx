import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DietaryRestrictions from "./pages/DietaryRestrictions";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetail from "./pages/MenuDetail";
import MenuScanner from "./pages/MenuScanner";
import Settings from "./pages/Settings";

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dietary-restrictions" element={<DietaryRestrictions />} />
      <Route path="/menu-scanner" element={<MenuScanner />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu-detail" element={<MenuDetail />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
