import { useEffect, useState } from "react";
import ResultComponent from "../components/ResultComponent";
import apiCall from "../utils/apiCall";
import Loader from "../components/Loader";
import MainNav from "../components/navbars/MainNav";

const Result = () => {
  const [resultStats, setResultStats] = useState("");
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(0);

  const getResult = async (id: string) => {
    setLoading(true);
    setLoadingStatus(30);
    const { data, status } = await apiCall({
      method: "POST",
      url: "/stats/get-result",
      reqData: {
        id: id,
      },
    });
    if (status == 200) {
      setResultStats(data);
    } else {
      setErrMessage(data);
    }
    setLoadingStatus(100);
    setLoading(false);
  };

  useEffect(() => {
    const url = location.href.split("/");
    const id = url[url.length - 1];
    getResult(id);
  }, []);
  return (
    <>
      <MainNav />
      {loading && (
        <Loader completed={loadingStatus} message="Getting Results" />
      )}
      {errMessage && !loading && (
        <div className="flex justify-center items-center h-screen w-screen text-4xl">
          <h1>{errMessage}</h1>
        </div>
      )}
      {!errMessage && resultStats && (
        <div className={`flex h-screen justify-center items-center`}>
          <ResultComponent stats={resultStats} />
        </div>
      )}
    </>
  );
};

export default Result;
