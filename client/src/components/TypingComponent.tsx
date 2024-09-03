import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";
import { useNavigate } from "react-router-dom";
import {
  revertRecentTestResults,
  setRecentTestResults,
} from "../redux/reducers/statSlice";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const [wordLoader, setWordLoader] = useState<boolean>(true);
  const [avgWordLength, setAvgWordLength] = useState(0);

  const setting = useSelector((state: any) => state.setting);
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
  //const [countdown, setCountDown] = useState(setting.time);
  const [countdown, setCountDown] = useState(setting.time);
  const [mode, setMode] = useState("");
  const [wordAccuracies, setWordAccuracies] = useState<number[]>([]);

  const calculateStandardDeviation = (arr: number[]) => {
    if (arr.length === 0) return 0;

    // Calculate mean accuracy
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;

    // Calculate standard deviation
    const squaredDiffs = arr.map((value) => Math.pow(value - mean, 2));
    const variance =
      squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to consistency percentage (higher is better consistency)
    const maxPossibleDeviation = Math.sqrt(mean * (1 - mean)); // Max deviation possible
    const consistencyPercentage =
      ((maxPossibleDeviation - standardDeviation) / maxPossibleDeviation) * 100;

    return consistencyPercentage;
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
    if (setting.time) value = 30;
    const { data } = await apiCall({
      method: "GET",
      url: `/type/get-words?words=${value}&type=${
        setting.typeOfText.length != 0 ? setting.typeOfText.join(",") : null
      }`,
    });
    setWordLoader(false);
    setAvgWordLength(data.avgwordlength);
    setMode(data.mode);
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
    testFinished.current = false;
    testStarted.current = true;
    removeClass(document.getElementById("typing-area"), "blur-sm");
    addClass(document.getElementById("typing-area"), "remove-blur");
    await apiCall({
      method: "PATCH",
      url: `/type/start-test`,
    });
  }

  

 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(revertRecentTestResults());
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setEndTestTime(new Date());
    }
    if (
      (testFinished.current && endTestTime && startTestTime) ||
      (countdown === 0 && endTestTime && startTestTime)
    ) {
      //console.log("true");
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
      dispatch(
        setRecentTestResults({
          wpm: Math.round(wpm),
          raw: Math.round(rawWPM),
          accuracy: Math.round(Number(accuracy)),
          consistency: Math.round(
            Number(calculateStandardDeviation(wordAccuracies))
          ),
          chars: `${correctLettersTyped}/${wrongLettersTyped}/${extraLetters}/${missedLetters}`,
          mode: mode,
        })
      );
      navigate(`/result`, { replace: true });
    }
  }, [
    totalLettersTyped,
    correctLettersTyped,
    wrongLettersTyped,
    totalWordsTyped,
    extraLetters,
    testFinished.current,
    endTestTime,
    startTestTime,
    countdown,
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
          setTimeout(() => {
            addClass(document?.querySelector(".word"), "current");
            addClass(document?.querySelector(".letter"), "current");
          }, 800);
        });
    } else if (scroll > 0 && setting.time) {
      setTypeString(typeString);
      getWords(setting.wordNumber).then((r) => printWords(r));
    }
  }, [setting, scroll]);

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
      startTest() 
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
        const wordAccuracy = correctLettersInWord / totalLettersInWord;
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

  return (
    <>
      {countdown && (
        <h1 className="text-4xl text-left text-yellow-400 relative">
          {countdown}
        </h1>
      )}
      <div
        className={`flex min-h-40 h-[200px] w-[85%] overflow-hidden flex-wrap  text-4xl`}
        id="typing-area"
      >
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
