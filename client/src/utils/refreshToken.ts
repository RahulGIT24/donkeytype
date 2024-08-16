import axios from "axios";

export async function refresh() {
  try {
    const res  = await axios.get(`${import.meta.env.VITE_SERVER_API}/users/refresh-token`,{withCredentials:true});
    console.log(res);
    return true;
  } catch (error) {
    return false;
  }
}
