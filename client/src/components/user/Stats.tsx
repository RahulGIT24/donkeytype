import axios from "axios";
import React from "react";

export default function Stats() {
  async function getHistory() {
    const res = axios(import.meta.env.VITE_SERVER_API + "/get-history", {
      withCredentials: true,
    });
  }

  async function getAverageStats() {
    const res = axios(import.meta.env.VITE_SERVER_API + "/get-average-stats", {
        withCredentials: true,
      });
  }

  return (
  <>

  </>
  );
}
