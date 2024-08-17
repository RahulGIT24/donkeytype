import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import getwords from "../utils/getwords";
import { legacy_createStore } from "@reduxjs/toolkit";
export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const setting = useSelector((state: any) => state.setting);
  // const [focus,setFocus] = useState(false)
  //const [words, setWord] = useState("");
  //const str = words.split(" ");

  function formatWord(word: any) {
    let w = word.split("");
    return w;
  }

  // yaha se print ho rahe words
  function printWords(w: any) {
    console.log("print words execited");
    //console.log(str);

    const st = w.split(" ");
    st.forEach((element: any) => {
      setTypeString((prev: any) => [...prev, formatWord(element)]);
    });
  }

  //yaha se word set ho rahe hai THEEK HAI NA !!!!!! BHUUL MT BKLLLLL
  useEffect(() => {
    setTypeString([]);

    getwords(setting.wordNumber)
      .then((r) => printWords(r))
      .then(() => {
        addClass(document?.querySelector(".word"), "current");
        addClass(document?.querySelector(".letter"), "current");
      });

    console.log(setting.wordNumber);
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
    const currentWord = document.querySelector('.word.current')
    const expected = currentLetter?.innerHTML;
    console.log({ key, expected });
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";

    if (isLetter) {
      if (currentLetter) {
        addClass(currentLetter, key === expected ? "correct" : "wrong");
        removeClass(currentLetter, "current");
        console.log("remove class", currentLetter);
        console.log("next sibling", currentLetter.nextSibling);
        const nextLetter = currentLetter.nextSibling;
        if (nextLetter) addClass(nextLetter, "current");
      }
    }

    if (isSpace) {
      console.log("space");
      if (expected !== " ") {
        const lettersToInvalidate = [...document.querySelectorAll(
          ".word.current .letter:not(.correct)"
        )];
        console.log("lettersin sace ", lettersToInvalidate);
        lettersToInvalidate.forEach((letter) => {
          addClass(letter, "wrong");
        });
      }
      removeClass(currentWord,'current')
      addClass(currentWord?.nextSibling,'current')
      if(currentLetter){
        removeClass(currentLetter,'current')
      }
    }
    removeClass(document?.querySelector(".letter"), "current");
  }

  function addClass(element: any, name: any) {
    // console.log(document?.querySelector(".letter"));
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
        {typeString?.map((element: any, index) => {
          return (
            <div className="word mx-2" key={index}>
              {element.map((e: any) => {
                return <span className="letter">{e}</span>;
              })}
            </div>
          );
        })}
      </div>
      {/* <div className={`focus-error text-5xl relative bottom-72  focus:group  `} > Click here to focus</div> */}
    </>
  );
}
