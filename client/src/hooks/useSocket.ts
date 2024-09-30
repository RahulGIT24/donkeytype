import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SERVER_API);

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    console.log(isConnected)
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return socket;
};
