import React from "react";
import MainNav from "../components/navbars/mainNav";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-around h-screen overflow-hidden">
        <MainNav />
        <Outlet />
        <footer className="fixed bottom-0 flex justify-center w-full mb-4">
          Content here
        </footer>
      </div>
    </>
  );
}
