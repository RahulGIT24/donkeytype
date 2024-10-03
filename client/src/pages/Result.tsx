import { useEffect, useState } from "react";
import ResultComponent from "../components/ResultComponent";
import apiCall from "../utils/apiCall";
import Loader from "../components/Loader";
import MainNav from "../components/navbars/MainNav";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../redux/reducers/typeSettingSlice";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const [resultStats, setResultStats] = useState<null | string>("");
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(0);
  const [multiplayer,setMultiplayer] = useState(false);

  const recentTestResults = useSelector(
    (state: any) => state.stats.recentTestResults
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
  }, []);

  const getResult = async (id: string) => {
    setLoading(true);
    setLoadingStatus(45);
    const { data, status } = await apiCall({
      method: "POST",
      url: "/stats/get-result",
      reqData: {
        id: id,
      },
    });
    setMultiplayer(data.multiplayer)
    setLoadingStatus(60);
    if (status == 200) {
      setResultStats(data);
    } else {
      setErrMessage(data);
    }
    setLoadingStatus(100);
    setLoading(false);
  };

  const navigate = useNavigate();

  async function testOverUpdateStats() {
    if (!recentTestResults) {
      navigate("/", { replace: true });
      setResultStats(null);
      return;
    }
    const res = await apiCall({
      method: "POST",
      url: `/type/complete-test`,
      reqData: {
        wpm: recentTestResults.wpm,
        raw: recentTestResults.raw,
        accuracy: recentTestResults.accuracy,
        consistency: recentTestResults.consistency,
        chars: recentTestResults.chars,
        mode: recentTestResults.mode,
        multiplayer: recentTestResults.multiplayer,
        winner: recentTestResults.winner,
        opponent: recentTestResults.opponent,
      },
    });
    if (res.status === 200) {
      toast.success("Test Saved");
    }
    return;
  }

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      getResult(id);
    } else {
      setResultStats(recentTestResults);
      testOverUpdateStats();
    }
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
          <ResultComponent stats={resultStats} multiplayer={multiplayer} />
        </div>
      )}
    </>
  );
};

export default Result;