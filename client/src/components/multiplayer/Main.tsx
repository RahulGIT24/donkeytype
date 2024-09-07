import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainNav from "../navbars/MainNav";
import {
  faPlus,
  faRightToBracket,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Path } from "react-router-dom";

interface RoomBoxProps {
  icon: IconDefinition;
  text: String;
  link: Partial<Path> | String;
}

const RoomBox = ({ icon, text, link }: RoomBoxProps) => {
  return (
    <Link
      to={link as Partial<Path>}
      className="flex justify-center items-center flex-col w-[50%] h-[50vh] border-yellow-500 border cursor-pointer hover:bg-yellow-500 hover:text-zinc-900 mx-11 rounded-xl shadow-md shadow-yellow-500 hover:shadow-black"
    >
      <FontAwesomeIcon icon={icon} className="h-40" />
      <p className="text-5xl">{text}</p>
    </Link>
  );
};

const roomBoxConfig: Array<RoomBoxProps> = [
  {
    icon: faPlus,
    text: "Create Room",
    link: "/create-room",
  },
  {
    icon: faRightToBracket,
    text: "Join Room",
    link: "/join-room",
  },
];

const Main = () => {
  return (
    <>
      <MainNav />
      <main className="flex justify-center items-center text-yellow-500 w-full h-[100vh] px-28">
        {roomBoxConfig.map((item, index) => {
          return (
            <>
              <RoomBox
                icon={item.icon}
                text={item.text}
                key={index}
                link={item.link}
              />
            </>
          );
        })}
      </main>
    </>
  );
};

export default Main;
