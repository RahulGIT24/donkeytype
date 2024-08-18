import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import apiCall from "../utils/apiCall";

export default function TypingComponent() {
  const setting = useSelector((state: any) => state.setting);
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
 
  const [showTime, setShowTime] = useState(setting.time);
  const [wordLoader, setWordLoader] = useState<boolean>(true);

  function formatWord(word: any) {
    let w = word.split("");
    return w;
  }
  
  useEffect(() => {
    setShowTime(setting.time);
  }, [setting.time]);

 /*  const setTime = () => {           //not working 
    setInterval(() => {
      setShowTime(showTime - 1);
      if(showTime<=0) return
    }, 1050);
  }; */
  //setTime();                      //not working

  async function getwords(number: number) {
    setWordLoader(true);
    const { data } = await apiCall({
      method: "GET",
      url: `/type/get-words?words=${number}`,
    });
    setWordLoader(false);
    return data;
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
    getwords(setting.wordNumber)
      .then((r) => printWords(r))
      .then(() => {
        setTimeout(() => {
          addClass(document?.querySelector(".word"), "current");

          addClass(document?.querySelector(".letter"), "current");
        }, 800);
      });
  }, [setting.wordNumber]);

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
    //console.log({ expected, key });
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isbackSpace = key === "Backspace";
    const isFirstLetter = currentLetter === currentWord?.firstChild;
    //setTime();                                         //not working
    console.log(currentWord?.previousSibling) 
    if (isLetter) {
      if (currentLetter) {
        addClass(currentLetter, key === expected ? "correct" : "wrong");
        removeClass(currentLetter, "current");
        const nextLetter = currentLetter.nextSibling;
        if (nextLetter) addClass(nextLetter, "current");
      } else {
        const incorrectLetter = document.createElement("span");
        incorrectLetter.innerHTML = key;
        incorrectLetter.className = "letter  extra";
        currentWord?.appendChild(incorrectLetter);
      }
    }
    if (isbackSpace) {
      if (currentLetter && isFirstLetter &&currentWord.previousSibling!==undefined &&currentWord.previousSibling!==null) {
        console.log("backspace");
        removeClass(currentWord, "current");
        addClass(currentWord.previousSibling, "current");
        removeClass(currentLetter, "current");
        addClass(currentWord.previousSibling?.lastChild, "current");
        removeClass(currentWord.previousSibling?.lastChild, "wrong");
        removeClass(currentWord.previousSibling?.lastChild, "correct");
      }
      if (currentLetter && !isFirstLetter) {
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

        console.log("lettersin sace ", lettersToInvalidate);
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
        <h1 className="fixed text-yellow-400 text-7xl left-[15%] top-[20%]">
          {showTime}
        </h1>
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
