import { useDispatch, useSelector } from "react-redux";
import { setSetting } from "../../redux/reducers/typeSettingSlice";

export default function TypingNav() {
  const setting = useSelector((state: any) => state.setting);
  const dispatch = useDispatch();

  const times = ["10", "25", "50", "100"];

  const setTime = (e: any) => {
    dispatch(setSetting({ type: "number", value: e.target.innerText }));
  };

  return (
    <>
      <nav className="">
        <ul className="flex gap-4 bg-zinc-900 rounded-md p-2">
          {times.map((time) => (
            <li
              key={time}
              className={`hover:text-zinc-100 hover:cursor-pointer duration-200 ${
                setting.wordNumber === time ? "text-yellow-500" : ""
              }`}
              onClick={setTime}
            >
              {time}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
