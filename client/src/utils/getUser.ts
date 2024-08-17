import apiCall from "./apiCall";

export const getUser = async () => {
  try {
    const {data,status} = await apiCall({url:"/users/get-user",method:"GET"})
    return {status:status,data:data};
  } catch (e) {
    console.log(e)
    return {status:401,data:e}
  }
};
