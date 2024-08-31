import { useDispatch, useSelector } from "react-redux";
import {
  filterTypeOfText,
  setSetting,
  setTypeOfText,
} from "../../redux/reducers/typeSettingSlice";
import { useState } from "react";

export default function TypingNav() {
  const setting = useSelector((state: any) => state.setting);
  const [mode, setMode] = useState<string>("words");
  const dispatch = useDispatch();

  const words = ["10", "25", "50", "100",'limitless'];
  const time = ['10', '30', '60', '120'];
  const modes = ["time", "words"];
  const typeOfText = ["punctuations", "numbers"];

  const setWords = (e: any) => {
    dispatch(setSetting({ type: "number", value: e.target.innerText }));
  };

  function setTime(e: any) {
    dispatch(setSetting({ type: "time", value: e.target.innerText }));
  }

  return (
    <>
      <nav className="fixed top-[10%]">
        <ul className="flex gap-4 bg-zinc-900 rounded-md p-2">
          {typeOfText.map((t, i) => (
            <li
              key={i}
              className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                setting.typeOfText.includes(t) ? "text-yellow-500" : ""
              }`}
              onClick={() => {
                setting.typeOfText.includes(t)
                  ? dispatch(filterTypeOfText(t))
                  : dispatch(setTypeOfText(t));
              }}
            >
              {t}
            </li>
          ))}
          |
          {modes.map((m, i) => (
            <li
              key={i}
              className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                mode === m ? "text-yellow-500" : ""
              }`}
              onClick={() => {
                setMode(m);
               
              }}
            >
              {m}
            </li>
          ))}
          |
          {mode == "words" &&
            words.map((w, i) => (
              // <>
              <li
                key={i}
                className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                  setting.wordNumber === w ? "text-yellow-500" : ""
                }`}
                onClick={setWords}
              >
                {w}
              </li>
              // </>
            ))}
          {/* {mode==="words" && <>|</>} */}
          {mode === "time" &&
            time.map((t, i) => (
              // <>
              <li
                key={i}
                className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                  setting.time === t ? "text-yellow-500" : ""
                }`}
                onClick={setTime}
              >
                {t}
              </li>
              // </>
            ))}
        </ul>
      </nav>
    </>
  );
}