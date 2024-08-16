import axios from "axios";
import { useState, useEffect, Children } from "react";
import { useSelector } from "react-redux";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const setting= useSelector((state:any)=> state.setting)
  const [focus,setFocus] = useState(false)
  const [words,setWord]= useState('');
  const str = words.split(" ");

  async function getwords(){ 
    try {
      const response  = await axios(import.meta.env.VITE_SERVER_API+`/type/get-words?words=${setting.wordNumber}`,{
        withCredentials:true
      })
      console.log(response.data.data)
      setWord(response.data.data)
      
    } catch (error) {
        console.log(error)
    }
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
    setTypeString([])
    getwords()
    printWords();
    
  }, [setting]);

  useEffect(()=> {
    
    
  },[setting])
 

  return (
    <>
      <div
        className={`flex h-96 max-w-[70%] flex-wrap overflow-auto text-4xl `}
        id="words"
      >
        
        {typeString?.map((element: any, index) => {
          return (
            <div className="word mx-2" key={index}>
              {element.map((e: any) => {
                return <span className="letter" >{e}</span>;
              })}
            </div>
          );
        })}
      </div>
        {/* <div className={`focus-error text-5xl relative bottom-72  focus:group  `} > Click here to focus</div> */}
    </>
  );
}
