import axios from "axios";

export async function refresh() {
  try {
    await axios(`${import.meta.env.VITE_SERVER_API}/users/refresh-token`,{withCredentials:true});
    return true;
  } catch (error) {
    return false;
  }
}
