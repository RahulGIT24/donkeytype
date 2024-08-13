import React, { useState, useEffect, useRef } from "react";

export default function TypingComponent() {
  const [typeString, setTypeString] = useState<JSX.Element[]>([]);
  const statRef = useRef(null);
  const tempRef = useRef(0);
  const res =
    "In the heart of a bustling city, a small café stood nestled between towering buildings, offering a quiet retreat from the chaos outside. The aroma of freshly brewed coffee mingled with the sweet scent of pastries, drawing in weary travelers and locals alike. Soft jazz played in the background, creating a cozy atmosphere where conversations flowed freely. The walls were adorned with colorful paintings, each telling its own story. As the sun set, casting a warm glow through the large windows, the café became a haven for those seeking solace, comfort, and a brief escape from the world.";

  useEffect(() => {
    const str = [...res];
    const tempArray = str.map((element, index) => (
      <b
        key={index}
        id={index.toString()}
        className="text-2xl "
        style={{ whiteSpace: "pre" }}
        onKeyDownCapture={handleKeyCapture}
      >
        {element}
      </b>
    ));
    setTypeString(tempArray);
  }, [res]);


  const handleKeyCapture = (e:any)=>{
      document.getElementById(`${tempRef.current}`)?.addEventListener('keydown',(k:any)=>{
        if(k.key === document.getElementById(`${tempRef.current}`)?.innerText){
          console.log('yes')        
        }else console.log('no')
      })

      //if(e.target.value === e.target.innerText)
  }
  return (
    <>
      <div className="flex h-96 max-w-[60%] flex-wrap" >
        {typeString?.map((element) => element)}
      </div>
    </>
  );
}
