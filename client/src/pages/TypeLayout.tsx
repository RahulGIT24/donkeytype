import { useSelector } from "react-redux";
import TypingNav from "../components/navbars/TypingNav";
import TypingComponent from "../components/TypingComponent.js";

export default function TypeLayout() {
  const isMultiplayer = useSelector(
    (state: any) => state.multiplayer.multiplayer
  );
  return (
    <>
      <div className="flex justify-center items-center gap-20 flex-col">
        {!isMultiplayer && <TypingNav />}
        <TypingComponent />
      </div>
    </>
  );
}
