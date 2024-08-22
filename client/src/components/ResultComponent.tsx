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
//import { lineGraphData } from "./dummystats";

ChartJS.register(
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
);
export default function ResultComponent({stats}:any) {
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
  labels: ['WPM', 'Raw', 'Consistency', 'Accuracy'],
  datasets: [
      {
          label: 'Value',
          data: [
              Math.round(stats.wpm),         
              Math.round(stats.raw),  
              stats.consistency,
              stats.accuracy
          ],
          backgroundColor: ['yellow', 'grey', 'yellow', 'grey'],
      },
  ],
};

  return (
    <>
    
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
              <p className="text-yellow-400">{stats.consistency}</p>
            </div>
            <div className="flex flex-col" title="correct, incorrect, extra, missed">
              <p>characters</p>
              <p className="text-yellow-400">{stats.chars}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
