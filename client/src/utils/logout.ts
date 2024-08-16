import axios from "axios";

export async function logout() {
  try {
    //   setDisabled(true);
    const res = await axios.get(
      import.meta.env.VITE_SERVER_API + "/users/logout-user",
      { withCredentials: true }
    );
    const { success } = res.data;
    return success;
  } catch (error: any) {
    return false;
  }
}
