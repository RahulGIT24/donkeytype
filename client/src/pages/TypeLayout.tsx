import {useDispatch, useSelector } from "react-redux";
import TypingNav from "../components/navbars/TypingNav";
import TypingComponent from "../components/TypingComponent.js";
import { useEffect } from "react";
import { setUserLeft } from "../redux/reducers/multiplayerSlice.js";

export default function TypeLayout() {
  const isMultiplayer = useSelector(
    (state: any) => state.multiplayer.multiplayer
  );
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setUserLeft(false));
  },[])
  return (
    <>
      <div className="flex justify-center items-center gap-20 flex-col">
        {!isMultiplayer && <TypingNav />}
        <TypingComponent />
      </div>
    </>
  );
}
