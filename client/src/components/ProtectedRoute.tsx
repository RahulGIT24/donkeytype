import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { revertInitial, setAuth, setUser } from "../redux/reducers/userSlice";
import { getUser } from "../utils/getUser";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state:any) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const { status, data } = await getUser();
      dispatch(setAuth(status === 200));
      if (status === 200) {
        dispatch(setUser(data));
      } else {
        dispatch(revertInitial());
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
