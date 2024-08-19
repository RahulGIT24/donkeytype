/* import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";
import axios from "axios";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const [wordLoader, setWordLoader] = useState<boolean>(true);
  const setting = useSelector((state: any) => state.setting);
  const [lettersTyped, setLettersTyped] = useState<number>(0);
  const [wordsTyped, setWordsTyped] = useState<number>(0);
  const [correctLettersTyped, setCorrectLettersTyped] = useState<number>(0);
  const [wrongLettersTyped, setWrongLettersTyped] = useState<number>(0);
  const [missedLetters, setMissedLetters] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [durationseconds, setDurationSeconds] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const totalwordref = useRef<number>(0)
  const testStarted = useRef(false);
  const def = "The sun sets, casting golden hues across the tranquil lake";

  function formatWord(word: any) {
    let w = word.split("");
    return w;
  }


  async function getWords(number: number) {
    setWordLoader(true);
    const { data } = await apiCall({
      method: "GET",
      url: `/type/get-words?words=${number}`,
    });
    setWordLoader(false);
    return data || def;
  }

  const startTest = useCallback(async () => {
    if (!testStarted.current) {
      testStarted.current = true;
      await apiCall({
        method: "PATCH",
        url: `/type/start-test`,
      });
      setLettersTyped((prev) => prev + 1);
    }
  }, []);

  async function gameOver() {
    console.log("game over ");
    alert("game over ");
  }

  async function printWords(w: any) {
    const st = w.split(" ");
    st.forEach((element: any) => {
      setTypeString((prev: any) => [...prev, formatWord(element)]);
    });
    return st;
  }

  useEffect(() => {
    setTypeString([]);
    getWords(setting.wordNumber)
      .then((r) => printWords(r))
      .then(() => {
        setTimeout(() => {
          addClass(document?.querySelector(".word"), "current");
          addClass(document?.querySelector(".letter"), "current");
        }, 800);
      });
  }, [setting]);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (testStarted.current) {
      // started
      const start = new Date();
      setStartTime(start);
    } else if (startTime) {
      // ended
      const end = new Date();
      setEndTime(end);
      if (startTime && end) {
        const durationInSeconds = (end.getTime() - startTime.getTime()) / 1000;
        setDurationSeconds(durationInSeconds);
        setDurationMinutes(durationInSeconds / 60);
      }
    }
  }, [testStarted.current]);

  async function handleKeyPress(e: any) {
    console.log('keypress')
    const key = e.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML;
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const nextWord = currentWord?.nextSibling;
    const isFirstLetter = currentLetter === currentWord?.firstChild;

    if (isBackspace) return;

    if (!testStarted.current) {
      if (isSpace || isBackspace) {
        return;
      }
    }

    if (lettersTyped === 0 && !isSpace && !isBackspace) {
      await startTest();
    }

    // const isFirstLetter = currentLetter === currentWord?.firstChild;
    if (isLetter) {
      setLettersTyped((prev) => prev + 1);
      if (currentLetter) {
        const isCorrect = key === expected;
        if (isCorrect) {
          setCorrectLettersTyped((prev) => prev + 1);
        } else {
          setWrongLettersTyped((prev) => prev + 1);
        }
        addClass(currentLetter, isCorrect ? "correct" : "wrong");
        removeClass(currentLetter, "current");
        const nextLetter = currentLetter.nextSibling;
        if (!nextLetter) {
          setWordsTyped((prev) => prev + 1);
          if (!nextWord) {
            testStarted.current = false;
            removeClass(currentWord,'current')
            addClass(document.getElementById('typing-area'), 'blur-sm')
            document.removeEventListener('keyup', handleKeyPress);
            const totalLetters = correctLettersTyped + wrongLettersTyped + missedLetters;
            const wpm = (durationseconds > 0) ? (correctLettersTyped / 5) / (durationseconds / 60) : 0;
            //const raw =
              let stats = {
                wpm:wpm,
                raw: (durationseconds > 0) ? (lettersTyped / 5) / (durationseconds / 60) : 0,
                accuracy:(totalLetters > 0) ? (correctLettersTyped / totalLetters) * 100 : 0 ,
                chars:`${correctLettersTyped}/${wrongLettersTyped}/${missedLetters}` ,
                mode:`Words ${setting.wordNumber}`
              }
              console.log(wordsTyped)
            // compute stats
            // api call to save stats
            // const res = await axios.post(import.meta.env.VITE_SERVER_API,{
             // stats,
              withCredentials:true
            //}) 
            return;
          }
        } else {
          addClass(nextLetter, "current");
        }
      } else {
        setWrongLettersTyped((prev) => prev + 1);
       
      }
    }

    if (isBackspace) {
      if (
        currentLetter &&
        isFirstLetter &&
        currentWord.previousSibling !== undefined &&
        currentWord.previousSibling !== null
      ) {
        removeClass(currentWord, "current");
        addClass(currentWord.previousSibling, "current");
        removeClass(currentLetter, "current");
        addClass(currentWord.previousSibling?.lastChild, "current");
        removeClass(currentWord.previousSibling?.lastChild, "wrong");
        removeClass(currentWord.previousSibling?.lastChild, "correct");
      }
      if (currentLetter && !isFirstLetter) {
        if (currentLetter.classList.contains("current")) {
        } else {
          console.log(false);
        }
        removeClass(currentLetter, "current");
        addClass(currentLetter?.previousSibling, "current");
        removeClass(currentLetter?.previousSibling, "wrong");
        removeClass(currentLetter?.previousSibling, "wrong");
        removeClass(currentLetter?.previousSibling, "correct");
      }
    }

    if (isSpace) {
      console.log("space");
      if (expected !== " ") {
        const lettersToInvalidate = [
          ...document.querySelectorAll(".word.current .letter:not(.correct)"),
        ];
        lettersToInvalidate.forEach((letter) => {
          addClass(letter, "wrong");
        });
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
      <div
        className={`flex min-h-40 w-[85%] flex-wrap overflow-auto text-4xl`}
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
        )}
        
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
    </>
  );
}
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";
import axios from "axios";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const [wordLoader, setWordLoader] = useState<boolean>(true);
  const setting = useSelector((state: any) => state.setting);
  const lettersTypedRef = useRef<number>(0);
  const wordsTypedRef = useRef<number>(0);
  const correctLettersTypedRef = useRef<number>(0);
  const wrongLettersTypedRef = useRef<number>(0);
  const missedLettersRef = useRef<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const totalWordRef = useRef<number>(0);

  const testStarted = useRef(false);
  const def = "The sun sets, casting golden hues across the tranquil lake";

  function formatWord(word: any) {
    let w = word.split("");
    return w;
  }

  async function getWords(number: number) {
    setWordLoader(true);
    const { data } = await apiCall({
      method: "GET",
      url: `/type/get-words?words=${number}`,
    });
    setWordLoader(false);
    totalWordRef.current = data.length;
    return data || def;
  }

  const startTest = useCallback(async () => {
    if (!testStarted.current) {
      testStarted.current = true;
      await apiCall({
        method: "PATCH",
        url: `/type/start-test`,
      });
      lettersTypedRef.current += 1;
    }
  }, []);

  async function gameOver() {
    console.log("game over ");
    alert("game over ");
  }

  async function printWords(w: any) {
    const st = w.split(" ");
    st.forEach((element: any) => {
      setTypeString((prev: any) => [...prev, formatWord(element)]);
    });
    return st;
  }

  useEffect(() => {
    setTypeString([]);
    getWords(setting.wordNumber)
      .then((r) => printWords(r))
      .then(() => {
        setTimeout(() => {
          addClass(document?.querySelector(".word"), "current");
          addClass(document?.querySelector(".letter"), "current");
        }, 800);
      });
  }, [setting]);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (testStarted.current) {
      const start = new Date();
      setStartTime(start);
    } else if (startTime) {
      const end = new Date();
      setEndTime(end);
      if (startTime && end) {
        const durationInSeconds = (end.getTime() - startTime.getTime()) / 1000;
        setDurationSeconds(durationInSeconds);
        setDurationMinutes(durationInSeconds / 60);
      }
    }
  }, [testStarted.current]);

  async function handleKeyPress(e: any) {
    const key = e.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML;
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const nextWord = currentWord?.nextSibling;
    const isFirstLetter = currentLetter === currentWord?.firstChild;

    if (isBackspace) return;

    if (!testStarted.current) {
      if (isSpace || isBackspace) {
        return;
      }
    }

    if (lettersTypedRef.current === 0 && !isSpace && !isBackspace) {
      await startTest();
    }

    if (isLetter) {
      lettersTypedRef.current += 1;
      if (currentLetter) {
        const isCorrect = key === expected;
        if (isCorrect) {
          correctLettersTypedRef.current += 1;
        } else {
          wrongLettersTypedRef.current += 1;
        }
        addClass(currentLetter, isCorrect ? "correct" : "wrong");
        removeClass(currentLetter, "current");
        const nextLetter = currentLetter.nextSibling;
        if (!nextLetter) {
          wordsTypedRef.current += 1;
          if (!nextWord) {
            testStarted.current = false;
            removeClass(currentWord, "current");
            addClass(document.getElementById("typing-area"), "blur-sm");
            document.removeEventListener("keyup", handleKeyPress);
            /* const totalLetters =
              correctLettersTypedRef.current +
              wrongLettersTypedRef.current +
              missedLettersRef.current; */
            /* const totalLetters =totalWordRef.current
            const wpm =
              durationSeconds > 0
                ? correctLettersTypedRef.current / 5 / (durationSeconds / 60)
                : 0;
            let stats = {
              wpm: wpm,
              raw:
                durationSeconds > 0
                  ? lettersTypedRef.current / 5 / (durationSeconds / 60)
                  : 0,
              accuracy:
                totalLetters > 0
                  ? (correctLettersTypedRef.current / totalLetters) * 100
                  : 0,
              chars: `${correctLettersTypedRef.current}/${wrongLettersTypedRef.current}/${missedLettersRef.current}`,
              mode: `Words ${setting.wordNumber}`,
            }; */
            const totalLetters = lettersTypedRef.current;
            const timeInMinutes = durationSeconds / 60;

            const wpm =
              timeInMinutes > 0
                ? Math.round((wordsTypedRef.current / timeInMinutes) * 10) / 10
                : 0;

            const raw =
              timeInMinutes > 0
                ? Math.round((totalLetters / timeInMinutes) * 10) / 10
                : 0;

            const accuracy =
              totalLetters > 0
                ? Math.round(
                    (correctLettersTypedRef.current / totalLetters) * 10000
                  ) / 100
                : 0;

            const consistency = 56.4;

            const chars = `${correctLettersTypedRef.current}/${wrongLettersTypedRef.current}/${missedLettersRef.current}`;

            let stats = {
              wpm: wpm,
              raw: raw,
              accuracy: accuracy,
              consistency: consistency,
              chars: chars,
              mode: `Words ${setting.wordNumber}`,
            };

            console.log(stats);
            console.log(stats);
            console.log(totalWordRef);
            return;
          }
        } else {
          addClass(nextLetter, "current");
        }
      } else {
        wrongLettersTypedRef.current += 1;
      }
    }

    if (isBackspace) {
      if (
        currentLetter &&
        isFirstLetter &&
        currentWord.previousSibling !== undefined &&
        currentWord.previousSibling !== null
      ) {
        removeClass(currentWord, "current");
        addClass(currentWord.previousSibling, "current");
        removeClass(currentLetter, "current");
        addClass(currentWord.previousSibling?.lastChild, "current");
        removeClass(currentWord.previousSibling?.lastChild, "wrong");
        removeClass(currentWord.previousSibling?.lastChild, "correct");
      }
      if (currentLetter && !isFirstLetter) {
        if (currentLetter.classList.contains("current")) {
        } else {
          console.log(false);
        }
        removeClass(currentLetter, "current");
        addClass(currentLetter?.previousSibling, "current");
        removeClass(currentLetter?.previousSibling, "wrong");
        removeClass(currentLetter?.previousSibling, "wrong");
        removeClass(currentLetter?.previousSibling, "correct");
      }
    }

    if (isSpace) {
      if (expected !== " ") {
        const lettersToInvalidate = [
          ...document.querySelectorAll(".word.current .letter:not(.correct)"),
        ];
        lettersToInvalidate.forEach((letter) => {
          addClass(letter, "wrong");
        });
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
      <div
        className={`flex min-h-40 w-[85%] flex-wrap overflow-auto text-4xl`}
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
        )}
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
    </>
  );
}
