import MainNav from "../components/navbars/MainNav";
import TypeLayout from "./TypeLayout";

export default function Home() {
  return (
    <>
    <MainNav/>
      <div className="flex flex-col justify-around h-screen overflow-hidden">
        <TypeLayout/>
        <footer className="fixed bottom-0 flex justify-center w-full mb-4">
          Content here
        </footer>
      </div>
    </>
  );
}
