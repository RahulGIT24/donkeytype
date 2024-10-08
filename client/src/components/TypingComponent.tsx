import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";
import { useNavigate } from "react-router-dom";
import {
  revertRecentTestResults,
  setRecentTestResults,
} from "../redux/reducers/statSlice";
import { socket } from "../socket/socket";
import {
  setOppRes,
  setRes,
  setSocketId,
  setSocketInstance,
  setUserLeft,
} from "../redux/reducers/multiplayerSlice";
import {
  setAfkTimer,
  setAfkTimerRunning,
  setMode,
  setTime,
} from "../redux/reducers/typeSettingSlice";
import AfkTimer from "./multiplayer/AfkTimer";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const [wordLoader, setWordLoader] = useState<boolean>(true);
  const [avgWordLength, setAvgWordLength] = useState(0);
  const isMultiplayer = useSelector(
    (state: any) => state.multiplayer.multiplayer
  );

  const setting = isMultiplayer
    ? useSelector((state: any) => state.multiplayer.settings)
    : useSelector((state: any) => state.setting);

  const [totalLettersTyped, setTotalLettersTyped] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [correctLettersTyped, setCorrectLettersTyped] = useState(0);
  const [wrongLettersTyped, setWrongLettersTyped] = useState(0);
  const [missedLetters, setMissedLetters] = useState(0);
  const [extraLetters, setExtraLetters] = useState(0);
  const [startTestTime, setStartTestTime] = useState<Date | null>(null);
  const [endTestTime, setEndTestTime] = useState<Date | null>(null);
  const testStarted = useRef(false);
  const testFinished = useRef(false);
  const [scroll, setScroll] = useState(0);
  const [countdown, setCountDown] = useState(setting.time);
  const [startTimer, setStartTimer] = useState(3);
  const mode = useSelector((state: any) => state.setting.mode);
  const [wordAccuracies, setWordAccuracies] = useState<number[]>([]);
  const socketI = useSelector((state: any) => state.multiplayer.socketInstance);
  const roomId = useSelector((state: any) => state.multiplayer.roomId);
  const allUsersPresent = useSelector(
    (state: any) => state.multiplayer.allUsersPresent
  );

  useEffect(() => {
    dispatch(setTime());
  }, []);

  useEffect(() => {
    if (isMultiplayer) {
      if (!socketI) {
        socket.connect();
        dispatch(setSocketId(socket.id));
        dispatch(setSocketInstance(socket));
      }
      let interval = setInterval(() => {
        setStartTimer((prevCount: number) => {
          if (prevCount <= 0) {
            clearInterval(interval!);
            return -1;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  }, [socketI]);

  const calculateStandardDeviation = (arr: number[]) => {
    if (arr.length === 0) return 0;

    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const squaredDiffs = arr.map((value) => Math.pow(value - mean, 2));
    const variance =
      squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const standardDeviation = Math.sqrt(variance);

    if (mean === 1) {
      return 100;
    }

    const maxPossibleDeviation = Math.sqrt(mean * (1 - mean));
    const consistencyPercentage =
      ((maxPossibleDeviation - standardDeviation) / maxPossibleDeviation) * 100;

    return Number(consistencyPercentage);
  };

  function formatWord(word: any) {
    let w = word.split("");
    return w;
  }

  useEffect(() => {
    setCountDown(setting.time);
    testStarted.current = false;
  }, [setting.time]);

  const getWords = async (value: any) => {
    let mode = `Words ${value}`;
    if (setting.time) {
      value = 30;
      mode = `Time ${setting.time} S`;
    }
    const { data } = await apiCall({
      method: "GET",
      url: `/type/get-words?words=${value}&type=${
        setting.typeOfText.length != 0 ? setting.typeOfText.join(",") : null
      }&mode=${mode}`,
    });
    setWordLoader(false);
    setAvgWordLength(data.avgwordlength);
    dispatch(setMode(data.mode));
    return data.text;
  };

  useEffect(() => {
    let interval: any;
    if (testStarted.current) {
      if (Number(setting.time) > 0) {
        setCountDown(setting.time);
        interval = setInterval(() => {
          setCountDown((prevCount: number) => {
            if (prevCount <= 1) {
              clearInterval(interval!);
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [testStarted.current]);

  const startTest = async () => {
    dispatch(setAfkTimerRunning(false));
    testFinished.current = false;
    testStarted.current = true;
    removeClass(document.getElementById("typing-area"), "blur-sm");
    addClass(document.getElementById("typing-area"), "remove-blur");
    await apiCall({
      method: "PATCH",
      url: `/type/start-test`,
    });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(revertRecentTestResults());
    dispatch(setOppRes(null))
    dispatch(setUserLeft(false))
  }, []);

  const userLeft = useSelector((state: any) => state.multiplayer.userLeft);
  const currTimer = useSelector((state: any) => state.setting.afkTimer);

  useEffect(() => {
    if (countdown === 0) {
      setEndTestTime(new Date());
    }

    if ((!startTestTime && !endTestTime && userLeft && isMultiplayer ) || currTimer == 0) {
      console.log('empty')
      socket.emit("complete-test", roomId, {
        wpm: 0,
        raw: 0,
        accuracy: 0,
        consistency: 0,
        chars: `${0}/${0}/${0}/${0}`,
        mode: mode,
      });
      dispatch(
        setRecentTestResults({
          wpm: 0,
          raw: 0,
          accuracy: 0,
          consistency: 0,
          chars: `${0}/${0}/${0}/${0}`,
          mode: mode,
          multiplayer: isMultiplayer,
        })
      );
      navigate("/pvp-result", { replace: true });
      setScroll(0);
      dispatch(setAfkTimerRunning(true));
      dispatch(setAfkTimer(10));
    }

    if (startTestTime && userLeft && isMultiplayer) {
      console.log('user left')
      const endTestT = new Date();
      const durationInSeconds =
        (endTestT.getTime() - startTestTime.getTime()) / 1000;
      const durationInMinutes = durationInSeconds / 60;
      const rawWPM =
        (totalLettersTyped / avgWordLength) * (1 / durationInMinutes);
      const accuracy = (
        Math.round((correctLettersTyped / totalLettersTyped) * 100 * 100) / 100
      ).toFixed(2);
      const wpm = rawWPM * (Number(accuracy) / 100);
      let consistency = Math.round(
        Number(calculateStandardDeviation(wordAccuracies))
      );
      socket.emit("complete-test", roomId, {
        wpm: Math.round(wpm) ? Math.round(wpm) : 0,
        raw: Math.round(rawWPM) ? Math.round(rawWPM) : 0,
        accuracy: Math.round(Number(accuracy))
          ? Math.round(Number(accuracy))
          : 0,
        consistency: consistency ? consistency : 0,
        chars: `${correctLettersTyped}/${wrongLettersTyped}/${extraLetters}/${missedLetters}`,
        mode: mode,
      });
      dispatch(
        setRecentTestResults({
          wpm: Math.round(wpm) ? Math.round(wpm) : 0,
          raw: Math.round(rawWPM) ? Math.round(rawWPM) : 0,
          accuracy: Math.round(Number(accuracy))
            ? Math.round(Number(accuracy))
            : 0,
          consistency: Math.round(
            Number(calculateStandardDeviation(wordAccuracies))
          )
            ? Math.round(Number(calculateStandardDeviation(wordAccuracies)))
            : 0,
          chars: `${correctLettersTyped}/${wrongLettersTyped}/${extraLetters}/${missedLetters}`,
          mode: mode,
          multiplayer: isMultiplayer,
        })
      );
      dispatch(
        setRes({
          wpm: Math.round(wpm) ? Math.round(wpm) : 0,
          raw: Math.round(rawWPM) ? Math.round(rawWPM) : 0,
          accuracy: Math.round(Number(accuracy))
            ? Math.round(Number(accuracy))
            : 0,
          consistency: Math.round(
            Number(calculateStandardDeviation(wordAccuracies))
          )
            ? Math.round(Number(calculateStandardDeviation(wordAccuracies)))
            : 0,
          chars: `${correctLettersTyped}/${wrongLettersTyped}/${extraLetters}/${missedLetters}`,
          mode: mode,
          multiplayer: isMultiplayer,
        })
      );
      navigate("/pvp-result", { replace: true });
      setScroll(0);
      dispatch(setAfkTimerRunning(true));
      dispatch(setAfkTimer(10));
    }
   
    if (
      (testFinished.current && endTestTime && startTestTime) ||
      (countdown === 0 && endTestTime && startTestTime) ||
      (startTestTime && endTestTime && userLeft)
    ) {
      console.log('normal res')
      const durationInSeconds =
        (endTestTime.getTime() - startTestTime.getTime()) / 1000;
      const durationInMinutes = durationInSeconds / 60;
      const rawWPM =
        (totalLettersTyped / avgWordLength) * (1 / durationInMinutes);
      const accuracy = (
        Math.round((correctLettersTyped / totalLettersTyped) * 100 * 100) / 100
      ).toFixed(2);
      const wpm = rawWPM * (Number(accuracy) / 100);
      removeClass(document.getElementById("typing-area"), "remove-blur");
      addClass(document.getElementById("typing-area"), "blur-sm");
      document.removeEventListener("keyup", handleKeyPress);
      if (isMultiplayer && roomId && allUsersPresent) {
        socket.emit("complete-test", roomId, {
          wpm: Math.round(wpm) ? Math.round(wpm) : 0,
          raw: Math.round(rawWPM) ? Math.round(rawWPM) : 0,
          accuracy: Math.round(Number(accuracy))
            ? Math.round(Number(accuracy))
            : 0,
          consistency: Math.round(
            Number(calculateStandardDeviation(wordAccuracies))
          )
            ? Math.round(Number(calculateStandardDeviation(wordAccuracies)))
            : 0,
          chars: `${correctLettersTyped}/${wrongLettersTyped}/${extraLetters}/${missedLetters}`,
          mode: mode,
        });
      }
      dispatch(
        setRecentTestResults({
          wpm: Math.round(wpm) ? Math.round(wpm) : 0,
          raw: Math.round(rawWPM) ? Math.round(rawWPM) : 0,
          accuracy: Math.round(Number(accuracy))
            ? Math.round(Number(accuracy))
            : 0,
          consistency: Math.round(
            Number(calculateStandardDeviation(wordAccuracies))
          )
            ? Math.round(Number(calculateStandardDeviation(wordAccuracies)))
            : 0,
          chars: `${correctLettersTyped}/${wrongLettersTyped}/${extraLetters}/${missedLetters}`,
          mode: mode,
          multiplayer: isMultiplayer,
        })
      );
      if (isMultiplayer && roomId) {
        navigate("/pvp-result", { replace: true });
      } else {
        navigate(`/result`, { replace: true });
      }
      setScroll(0);
      dispatch(setAfkTimerRunning(true));
      dispatch(setAfkTimer(10));
    }
  }, [
    userLeft,
    totalLettersTyped,
    correctLettersTyped,
    wrongLettersTyped,
    totalWordsTyped,
    extraLetters,
    testFinished.current,
    endTestTime,
    startTestTime,
    countdown,
    allUsersPresent,
    currTimer,
  ]);

  async function printWords(w: any) {
    const st = w.split(" ");
    st.forEach((element: any) => {
      setTypeString((prev: any) => {
        return [...prev, formatWord(element)];
      });
    });
    return st;
  }

  useEffect(() => {
    if (scroll === 0) {
      setTypeString([]);
      getWords(setting.wordNumber)
        .then((r) => printWords(r))
        .then(() => {
          setTimeout(
            () => {
              addClass(document?.querySelector(".word"), "current");
              addClass(document?.querySelector(".letter"), "current");
            },
            isMultiplayer ? 4500 : 800
          );
        });
    } else if (scroll > 0 && setting.time) {
      setTypeString(typeString);
      getWords(setting.wordNumber).then((r) => printWords(r));
    }
  }, [
    setting.words,
    scroll,
    navigate,
    setting.wordNumber,
    setting.typeOfText,
    setting.time,
  ]);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  async function handleKeyPress(e: any) {
    if (testFinished.current) {
      return;
    }
    const key = e.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML;
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const nextWord = currentWord?.nextSibling;
    let nextLetter;

    if (isBackspace) return;

    if (!testStarted.current) {
      if (isSpace) {
        return;
      }
    }

    if (!testStarted.current && !isSpace) {
      setStartTestTime(new Date());
      startTest();
    }
    const typing_area = document.getElementById("words");
    if (
      typing_area &&
      currentWord &&
      currentWord?.getBoundingClientRect().top > window.innerHeight / 2
    ) {
      const margin = parseInt(typing_area?.style.marginTop || "0px");
      typing_area.style.marginTop = margin - 40 + "px";
      setScroll((prev: any) => prev + 1);
    }

    if (isLetter) {
      setTotalLettersTyped((prev) => prev + 1);
      if (currentLetter) {
        const isCorrect = key === expected;
        if (isCorrect) {
          setCorrectLettersTyped((prev) => prev + 1);
        } else {
          setWrongLettersTyped((prev) => prev + 1);
        }
        addClass(currentLetter, isCorrect ? "correct" : "wrong");
        removeClass(currentLetter, "current");
        nextLetter = currentLetter.nextSibling;

        if (!nextLetter) {
          if (!nextWord) {
            testFinished.current = true;
            setEndTestTime(new Date());
            removeClass(currentWord, "current");
            return;
          } else {
            setTotalWordsTyped((prev) => prev + 1);
          }
        } else {
          addClass(nextLetter, "current");
        }
      } else if (!nextLetter && nextWord) {
        setExtraLetters((prev) => prev + 1);
      }
    }

    if (isSpace) {
      if (currentWord != null) {
        const correctLettersInWord =
          currentWord.querySelectorAll(".correct").length;
        const totalLettersInWord =
          currentWord.querySelectorAll(".letter").length;

        const wordAccuracy =
          totalLettersInWord > 0
            ? correctLettersInWord / totalLettersInWord
            : 1;

        setWordAccuracies((prev) => [...prev, wordAccuracy]);
      }

      setTotalLettersTyped((prev) => prev + 1);

      if (expected !== " ") {
        const lettersToInvalidate = [
          ...document.querySelectorAll(
            ".word.current .letter:not(.correct):not(.wrong)"
          ),
        ];
        setMissedLetters((prev) => prev + lettersToInvalidate.length);
        lettersToInvalidate.forEach((letter) => {
          addClass(letter, "wrong");
        });
        removeClass(currentLetter, "current");
        removeClass(currentWord, "current");
      }

      if (nextWord === null) {
        testFinished.current = true;
        setEndTestTime(new Date());
        removeClass(currentWord, "current");
        removeClass(currentLetter, "current");
        return;
      }

      removeClass(currentWord, "current");
      addClass(currentWord?.nextSibling, "current");
      addClass(currentWord?.nextSibling?.firstChild, "current");
      if (currentLetter) {
        removeClass(currentLetter, "current");
      }
    }

    removeClass(document?.querySelector(".letter"), "current");
  }

  function addClass(element: any, name: any) {
    if (element) element.className += " " + name;
  }

  function removeClass(element: any, name: any) {
    if (element) element.className = element.className.replace(name, "");
  }

  return isMultiplayer && startTimer > -1 ? (
    <MultiplayerTimer timer={startTimer} />
  ) : (
    <>
      {isMultiplayer && <AfkTimer />}
      <div
        className={`flex min-h-40 h-[200px] w-[85%] overflow-hidden flex-wrap  text-4xl`}
        id="typing-area"
      >
        {countdown && (
          <div className="text-3xl text-yellow-400 text-center w-full ">
            {countdown}
          </div>
        )}
        {wordLoader && (
          <div className="flex justify-center items-center w-full">
            <Oval
              visible={true}
              height="80"
              width="80"
              color="rgb(234 179 8 / var(--tw-text-opacity))"
              ariaLabel="oval-loading"
              secondaryColor="transparent"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}{" "}
        <div id="words" className="flex flex-wrap h-36">
          {!wordLoader &&
            typeString?.map((element: any, index) => {
              return (
                <div className="word mx-2 my-2 text-3xl" key={index}>
                  {element.map((e: any, index: number) => {
                    return (
                      <span className="letter" key={index}>
                        {e}
                      </span>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

const MultiplayerTimer = ({ timer }: any) => {
  return (
    <h1 className="text-9xl text-left text-yellow-400 relative">
      {timer == 0 ? "GO!!!" : timer}
    </h1>
  );
};

// const AFKTimer = ({
//   startTimer,
//   allUsersPresent,
//   setParentAfkTimer,
//   isTestStarted,
//   isMultiplayer,
// }: any) => {
//   const [afkTimer, setAfkTimer] = useState<any>(10);

//   useEffect(() => {
//     let afkinterval = null;

//     if (startTimer <= 0 && allUsersPresent && !isTestStarted) {
//       afkinterval = setInterval(() => {
//         setAfkTimer((prevCount: any) => {
//           if (prevCount > 1) {
//             return prevCount - 1;
//           } else {
//             clearInterval(afkinterval!);
//             setParentAfkTimer(-1);
//             return null;
//           }
//         });
//       }, 1000);
//     }

//     return () => {
//       if (afkinterval) {
//         clearInterval(afkinterval);
//       }
//     };
//   }, [startTimer, allUsersPresent, isTestStarted]);

//   if (afkTimer === null || !isMultiplayer || isTestStarted) return null;

//   return (
//     <div className="text-4xl text-left text-yellow-400 relative countdow">
//       Start typing before: {afkTimer}s
//     </div>
//   );
// };
