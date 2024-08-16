import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { revertInitial, setAuth, setUser } from "../redux/reducers/userSlice";
import { getUser } from "../utils/getUser";
import { refresh } from "../utils/refreshToken";
import { logout } from "../utils/logout";
import Loader from "./Loader";

const ProtectedRoute = () => {
  const [loader, setLoader] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      setLoader(50);
      const { status, data } = await getUser();
      if (status == 200) {
        dispatch(setAuth(true));
      } else {
        dispatch(setAuth(false));
      }

      if (status === 200) {
        dispatch(setUser(data));
        setLoader(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 700);
      } else if (status === 401) {
        setIsLoading(false);
        if (await refresh()) {
          await checkAuth();
        } else {
          if (await logout()) {
            dispatch(revertInitial);
          }
        }
      }
    };
    checkAuth();
  }, []);

  return isLoading === true ? (
    <Loader completed={loader} />
  ) : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
