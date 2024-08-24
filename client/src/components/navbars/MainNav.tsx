import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faGear,
  faInfo,
  faKeyboard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserProfileCard from "../UserProfileCard";

export default function MainNav() {
  const [showProfile, setShowProfile] = useState(false);
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );

  return (
    <>
     <nav className="flex fixed top-0 w-full z-20">
  <ul className="flex text-zinc-400 justify-between w-screen p-4">
    <li>
      <div>
        <ul className="flex flex-row gap-4 items-center">
          <li>
            <Link to="/">
              <h1 className="text-2xl">donkeytype</h1>
            </Link>
          </li>
          <li title="Start Test">
            <Link to="/">
              <FontAwesomeIcon icon={faKeyboard} className="h-5 px-4" />
            </Link>
          </li>
          <li title="Leaderboard">
            <Link to="/leaderboard">
              <FontAwesomeIcon icon={faCrown} className="h-5 px-4" />
            </Link>
          </li>
          <li title="Info">
            <Link to="/info">
              <FontAwesomeIcon icon={faInfo} className="h-5 px-4" />
            </Link>
          </li>
          <li title="Settings">
            <Link to="/settings">
              <FontAwesomeIcon icon={faGear} className="h-5 px-4" />
            </Link>
          </li>
        </ul>
      </div>
    </li>
    <li className="relative group">
      <Link to="/account">
        <div title="Profile Card">
          <FontAwesomeIcon icon={faUser} className="h-5 px-4" />
        </div>
      </Link>
      <div className="absolute right-0 -top-6 mt-2  scale-0 group-hover:scale-100 origin-top duration-75  ">
        <UserProfileCard />
      </div>
    </li>
  </ul>
</nav>

    </>
  );
}
