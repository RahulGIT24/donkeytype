import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";

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
  const [endTime, setEndTime] = useState<Date |  null>(null);
  const [durationseconds, setDurationSeconds] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const testStarted = useRef(false); 

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
    return data;
  }

  async function startTest() {
    if (!testStarted.current) {
      testStarted.current = true; 
      await apiCall({
        method: "PATCH",
        url: `/type/start-test`,
      });
      setLettersTyped((prev) => prev + 1);
    }
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
        setDurationMinutes(durationInSeconds/60)
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

    if(isBackspace) return;

    if (!testStarted.current) {
      if(isSpace || isBackspace){
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
          if(!nextWord){
            testStarted.current = false;
            // compute stats
            // api call to save stats
            return;
          } 
        } else {
          addClass(nextLetter, "current");
        }
      } else {
        setWrongLettersTyped((prev) => prev + 1);
        const incorrectLetter = document.createElement("span");
        incorrectLetter.innerHTML = key;
        incorrectLetter.className = "letter wrong extra";
        currentWord?.appendChild(incorrectLetter);
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
        {/* {!wordLoader && typeString.length === 0 && <div className="flex justify-center items-center w-full text-yellow-400">Words Not Found</div>} */}
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
