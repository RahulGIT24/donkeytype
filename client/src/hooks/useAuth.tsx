import { useEffect, useState } from "react";
import axios from "axios";

function useAuth() {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    checkUser();
  }, [success]);

  async function checkUser() {
    try {
      const res = await axios(
        `${import.meta.env.VITE_SERVER_API}/users/refresh-token`
      )
      if (res) {
        setSuccess(res.data.success);
      }
    } catch (error: any) {
      setSuccess(error.response.data.success);
    }
  }

  return success;
}
export default useAuth;
