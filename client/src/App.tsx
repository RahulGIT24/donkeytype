import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterationPage from "./pages/auth/RegisterationPage";
import NotFound from "./pages/ErrorPage";
import Verification from "./pages/auth/Verification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // const [authenticated,setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<RegisterationPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verifyToken/:token" element={<Verification />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
