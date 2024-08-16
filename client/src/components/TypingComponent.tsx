import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);

  const [focus,setFocus] = useState(false)
  const res =
    "In the heart of a bustling city, a small café stood nestled between towering buildings, offering a quiet retreat from the chaos outside. The aroma of freshly brewed coffee mingled with the sweet scent of pastries, drawing in weary travelers and locals alike. Soft jazz played in the background, creating a cozy atmosphere where conversations flowed freely. The walls were adorned with colorful paintings, each telling its own story. As the sun set, casting a warm glow through the large windows, the café became a haven for those seeking solace, comfort, and a brief escape from the world.";
  const str = res.split(" ");

  async function getwords(){ 
    const response  = axios(import.meta.env.VITE_SERVER_API+`type/get-words?words=${}`,{
      
    })
  }

  function formatWord(word: any) {
    let w = word.split("");

    return w;
  }
  function printWords() {
    str.forEach((element: any) => {
      setTypeString((prev: any) => [...prev, formatWord(element)]);
    });
  }
  useEffect(() => {
    printWords();
  }, []);

  console.log("type string ", typeString);

  return (
    <>
      <div
        className={`flex h-96 max-w-[70%] flex-wrap overflow-auto text-4xl   ${!focus?' md:blur-lg':''} group-focus:`}
        id="words"
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
        <div className={`focus-error text-5xl relative bottom-72  focus:group  `} > Click here to focus</div>
    </>
  );
}
