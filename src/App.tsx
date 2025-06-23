import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import "./App.css"
import DietaryRestrictions from "./pages/DietaryRestrictions"
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import MenuDetail from "./pages/MenuDetail"
import MenuScanner from "./pages/MenuScanner"
import Settings from "./pages/Settings"

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dietary-restrictions">Dietary Restrictions</Link>
            </li>
            <li>
              <Link to="/menu-scanner">Menu Scanner</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/menu-detail">Menu Detail</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dietary-restrictions" element={<DietaryRestrictions />} />
            <Route path="/menu-scanner" element={<MenuScanner />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu-detail" element={<MenuDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
