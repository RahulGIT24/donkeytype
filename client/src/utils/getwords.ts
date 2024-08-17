import axios from "axios";

export default async function getwords(number:any) {
    try {
      const response = await axios(
        import.meta.env.VITE_SERVER_API +
          `/type/get-words?words=${number}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      //setWord(response.data.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }