import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Verification() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("");
  const [verified,setVerified] = useState(false);
  const verfiyToken = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/users/verify`,
        { token }
      );
      setMessage(res.data.data);
      setVerified(true);
    } catch (error: any) {
      setMessage(error.response.data.data);
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      verfiyToken();
    }
  }, []);

  return (
    <>
      <h1 className="m-4 text-4xl hover:text-yellow-400 duration-200 cursor-none">
        donkeytype
      </h1>
      <div className="fixed w-screen h-screen flex justify-center items-center">
        <p className="text-3xl text-yellow-400">
        {message}
        </p>
        <br/>
        {
          verified && <p className="text-md"><Link to={"/login"}>Go Back to Login</Link></p>
        }
      </div>
    </>
  );
}
