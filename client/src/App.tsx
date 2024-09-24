import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import RegisterationPage from "./pages/auth/RegisterationPage";
import NotFound from "./pages/ErrorPage";
import Verification from "./pages/auth/Verification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import UserDetails from "./pages/UserDetails";
import Result from "./pages/Result";
import { getUser } from "./utils/getUser";
import { setAuth } from "./redux/reducers/userSlice";
import { useEffect } from "react";
import Main from "./components/multiplayer/Main";
import CreateRoom from "./components/multiplayer/CreateRoom";
import JoinRoom from "./components/multiplayer/JoinRoom";
import { initializeSocket } from "./redux/reducers/multiplayerSlice";
import MultiplayerResult from "./components/multiplayer/MutiplayerResult";

function App() {
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );
  const dispatch = useDispatch();
  async function checkAuth() {
    const { status } = await getUser();
    dispatch(setAuth(status === 200));
  }
  useEffect(() => {
    checkAuth();
    dispatch(initializeSocket() as any);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterationPage />
            )
          }
        />
        <Route
          path="/forgotPassword"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />
          }
        />
        <Route
          path="/verifyToken/:token"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Verification />
          }
        />
        <Route
          path="/change-password/:token"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <ChangePassword />
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/:roomId?" element={<Home />} />
          <Route path="/account" element={<UserDetails />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/result" element={<Result />} />
          <Route path="/pvp-result" element={<MultiplayerResult />} />
          <Route path="/multiplayer" element={<Main />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
