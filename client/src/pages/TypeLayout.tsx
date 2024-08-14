import TypingNav from "../components/navbars/TypingNav";
import TypingComponent from "../components/TypingComponent";

export default function TypeLayout() {
  return (
    <>
      <div className="flex justify-center items-center gap-20 flex-col">
        <TypingNav />
        <TypingComponent />
      </div>
    </>
  );
}
