import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import RegisterationPage from "./pages/auth/RegisterationPage";
import { Toaster } from "sonner";
import TypeLayout from "./pages/TypeLayout";
import { Provider } from "react-redux";
import store from "./redux/store";
import NotFound from "./pages/ErrorPage";
import Verification from "./pages/auth/Verification";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement:<NotFound/>,
      children: [
        {
          path: "/",
          element: <TypeLayout />,
        },
        {
          path: "login",
          element: <RegisterationPage />,
        },
        
      ],
    },
    {
      path: "verifyToken/:token",
      element: <Verification />,
    }
  ]);
  return (
    <>
      <Provider store={store}>
        <Toaster />
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
