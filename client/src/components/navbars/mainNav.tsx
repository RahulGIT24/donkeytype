import React from "react";
import { Link } from "react-router-dom";

export default function MainNav() {
  return (
    <>
      <nav className="flex fixed top-0">
        <ul className="flex text-zinc-400 justify-between w-screen p-4 z-20">
          <li>
            <div>
              <ul className="flex flex-row gap-4 px-5 items-center">
                <li>
                  <Link to="/">
                    <h1 className="text-2xl">donkeytype</h1>
                  </Link>
                </li>
                <li>
                  <Link to="/keyboard">keyboard</Link>
                </li>
                <li>
                  <Link to="/leaderboard">leaderboard</Link>
                </li>
                <li>
                  <Link to="/info">info</Link>
                </li>
                <li>
                  <Link to="/settings">settings</Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to="/login">
              <div>account</div>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
