import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAfkTimer } from "../../redux/reducers/typeSettingSlice";

export default function AfkTimer() {
  const currTimer = useSelector((state: any) => state.setting.afkTimer);
  const afkTimerRunning = useSelector(
    (state: any) => state.setting.afkTimerRunning
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (afkTimerRunning == true) {
      if (currTimer != 0) {
        const interval = setInterval(() => {
          dispatch(setAfkTimer(currTimer - 1));
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [currTimer]);

  return afkTimerRunning ? (
    <p className="text-yellow-400 text-lg">Start Typing In: {currTimer}</p>
  ) : (
    <>{afkTimerRunning?'true':"false"}</>
  );
}
