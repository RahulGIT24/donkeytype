import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import MainNav from "../../components/navbars/MainNav";
import apiCall from "../../utils/apiCall";

export default function Verification() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const verfiyToken = async () => {
    const { data, status } = await apiCall({
      url: "/users/verify",
      reqData: {
        token,
      },
      method: "POST",
      withCredentials:false
    });
    if (status >= 400) {
    } else {
      setMessage(data);
      setVerified(true);
    }
  };

  useEffect(() => {
    if (token) {
      verfiyToken();
    }
  }, []);

  return (
    <>
      <MainNav />
      <div className="fixed w-screen h-screen flex justify-center items-center">
        <p className="text-3xl text-yellow-400">{message}</p>
        <br />
        {verified && (
          <p className="text-md">
            <Link to={"/login"}>Go Back to Login</Link>
          </p>
        )}
      </div>
    </>
  );
}
