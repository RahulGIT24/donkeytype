import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const [wordLoader, setWordLoader] = useState<boolean>(true);
  const setting = useSelector((state: any) => state.setting);
  function formatWord(word: any) {
    let w = word.split("");
    return w;
  }

  async function getwords(number: number) {
    setWordLoader(true);
    const {data} = await apiCall({ method: "GET", url: `/type/get-words?words=${number}`});
    setWordLoader(false);
    return data
  }

  function printWords(w: any) {
    const st = w.split(" ");
    st.forEach((element: any) => {
      setTypeString((prev: any) => [...prev, formatWord(element)]);
    });
  }

  useEffect(() => {
    setTypeString([]);
    getwords(setting.wordNumber)
      .then((r) => printWords(r))
      .then(() => {
        addClass(document?.querySelector(".word"), "current");
        addClass(document?.querySelector(".letter"), "current");
      });
  }, [setting]);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);

    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  function handleKeyPress(e: any) {
    const key = e.key;
    const currentLetter = document.querySelector(".letter.current");
    const currentWord = document.querySelector(".word.current");
    const expected = currentLetter?.innerHTML;
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";

    if (isLetter) {
      if (currentLetter) {
        addClass(currentLetter, key === expected ? "correct" : "wrong");
        removeClass(currentLetter, "current");
        const nextLetter = currentLetter.nextSibling;
        if (nextLetter) addClass(nextLetter, "current");
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
      console.log(currentWord);
      addClass(currentWord?.nextSibling?.firstChild, "current");
      if (currentLetter) {
        removeClass(currentLetter, "current");
      }
    }
    removeClass(document?.querySelector(".letter"), "current");
  }

  function addClass(element: any, name: any) {
    element.className += " " + name;
  }

  function removeClass(element: any, name: any) {
    element.className = element.className.replace(name, "");
  }

  return (
    <>
      <div
        className={`flex h-96 max-w-[70%] flex-wrap overflow-auto text-4xl `}
        id="typing-area "
      >
        {wordLoader && (
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
        )}
        {!wordLoader && typeString.length === 0 && <div></div>}
        {!wordLoader &&
          typeString?.map((element: any, index) => {
            return (
              <div className="word mx-2" key={index}>
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
