import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import MainNav from "../../components/navbars/MainNav";
import apiCall from "../../utils/apiCall";
import Loader from "../../components/Loader";

export default function Verification() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadedStatus,setLoadStatus] = useState(0)
  const verfiyToken = async () => {
    setLoading(true);
    setLoadStatus(60)
    const { data, status } = await apiCall({
      url: "/users/verify",
      reqData: {
        token,
      },
      method: "POST",
      withCredentials: false,
    });
    if (status >= 400) {
      setLoadStatus(100)
      setMessage(data);
      setVerified(false);
      setLoading(false);
    } else {
      setLoadStatus(100)
      setMessage(data);
      setVerified(true);
      setLoading(false);
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
        {
          loading && <>
          <Loader completed={loadedStatus} message="Verifying....."/>
          </>
        }
        {!loading && (
          <>
            <p className="text-3xl text-yellow-400">{message}</p>
            <br />
            {verified && (
              <p className="text-md">
                <Link to={"/login"}>Go Back to Login</Link>
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
