import { useDispatch, useSelector } from "react-redux";
import { setSetting } from "../../redux/reducers/typeSettingSlice";

export default function TypingNav() {
  const setting = useSelector((state: any) => state.setting);
  const dispatch = useDispatch();

  const words = ["10", "25", "50", "100"];
  const time = ["10", "30", "60", "120"];

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
          {words.map((w) => (
            <li
              key={w}
              className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                setting.wordNumber === w ? "text-yellow-500" : ""
              }`}
              onClick={setWords}
            >
              {w}
            </li>
          ))}
          |
          {time.map((t) => (
            <li
              key={t}
              className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                setting.time === t ? "text-yellow-500" : ""
              }`}
              onClick={setTime}
            >
              {t}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
