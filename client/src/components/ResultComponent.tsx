import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import MainNav from "./navbars/MainNav";
import ResultCard from "./multiplayer/ResultCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
);
export default function ResultComponent({
  stats,
  multiplayer,
}: {
  stats: any;
  multiplayer: boolean;
}) {
  const options = {
    plugins: {
      tooltip: {
        bodyFont: {
          size: 16,
        },
        titleFont: {
          size: 18,
        },
        footerFont: {
          size: 14,
        },
        padding: 10,
      },
    },
  };
  const data = {
    labels: ["WPM", "Raw", "Consistency", "Accuracy"],
    datasets: [
      {
        label: "Value",
        data: [
          Math.round(stats.wpm),
          Math.round(stats.raw),
          stats.consistency,
          stats.accuracy,
        ],
        backgroundColor: ["yellow", "grey", "yellow", "grey"],
      },
    ],
  };

  const userId = useSelector((state:any)=>state.user.user._id)

  const [user1Message, setUser1Message] = useState("");
  const [user2Message, setUser2Message] = useState("");
  const [tieMessage, setTieMessage] = useState<string | null>(null);

  useEffect(() => {
    if (stats.winner === userId && stats.tie === false) {
      document.querySelector("#user1")?.classList.add("border-win");
      document.querySelector("#user2")?.classList.add("border-loose");
      setUser1Message("Winner");
      setUser2Message("Loser");
    } else if (stats.winner !== userId && stats.tie === false) {
      document.querySelector("#user2")?.classList.add("border-win");
      document.querySelector("#user1")?.classList.add("border-loose");
      setUser2Message("Winner");
      setUser1Message("Loser");
    } else {
      setTieMessage("Match Tied");
    }
  }, [stats]);

  return (
    <>
      {!multiplayer ? (
        <div className="fixed  flex   w-[70%] h-[50%]">
          <div className="flex flex-col gap-4 text-6xl p-8">
            <div className="flex flex-col  ">
              <p>wpm</p>
              <p className="text-yellow-400">{stats.wpm}</p>
            </div>
            <div className="flex flex-col ">
              <p>acc</p>
              <p className="text-yellow-400">{stats.accuracy}%</p>
            </div>
          </div>
          <div className="flex flex-col w-[70%]">
            <Bar options={options} data={data} />
            <div className="flex gap-20 flex-wrap flex-1 text-3xl ">
              <div className="flex flex-col  ">
                <p>test type</p>
                <p className="text-yellow-400">{stats.mode}</p>
              </div>
              <div className="flex flex-col  ">
                <p>raw</p>
                <p className="text-yellow-400">{stats.raw}</p>
              </div>
              <div className="flex flex-col ">
                <p>consistency</p>
                <p className="text-yellow-400">{stats.consistency}%</p>
              </div>
              <div
                className="flex flex-col"
                title="correct, incorrect, extra, missed"
              >
                <p>characters</p>
                <p className="text-yellow-400">{stats.chars}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <MainNav />
          <div className=" flex justify-center items-center w-full h-full absolute text-white overflow-hidden">
            <div className="flex justify-center items-center h-[100%] w-[50%] flex-col">
              <ResultCard
                user={stats.user1}
                stats={stats.user1Results}
                id={"user1"}
              />
              {!tieMessage && (
                <p className="font-semibold text-4xl mt-5 text-yellow-400 shadow-md shadow-yellow-600 p-4 bg-black">
                  {user1Message}
                </p>
              )}
            </div>
            {tieMessage && (
              <p className="font-semibold text-4xl mt-5 text-yellow-400 shadow-md shadow-yellow-600 p-4 absolute bg-black z-40">
                {tieMessage}
              </p>
            )}
            <hr className="w-screen fixed  rotate-90 border-none bg-yellow-500 h-[2px]" />
            <div className="flex justify-center items-center h-screen w-[50%] flex-col">
              <ResultCard
                user={stats.user2}
                stats={stats.user2Results}
                id={"user2"}
              />
              {!tieMessage && (
                <p className="font-semibold text-4xl mt-5 text-yellow-400 shadow-md shadow-yellow-600 p-4 bg-black">
                  {user2Message}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
