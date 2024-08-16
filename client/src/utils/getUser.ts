import axios from "axios";

export const getUser = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/users/get-user`,
      { withCredentials: true }
    );

    return {status:res.status,data:res.data.data};
  } catch (e) {
    console.log(e)
    return {status:401,data:e}
  }
};
