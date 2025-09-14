import { setTime, getTime } from "./store.js";

const convertToSeconds = (time) => {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

let timerInterval;
const nowTime = getTime();
let seconds = nowTime == undefined ? 0 : convertToSeconds(nowTime);

const updateTimer = () => {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  setTime(formattedTime);
  document.getElementById("timer").textContent = formattedTime;
};

export const timeTo = (action = "start") => {
  switch (action) {
    case "start":
      timerInterval = setInterval(updateTimer, 1000);
      break;
    case "stop":
      clearInterval(timerInterval);
      break;
    case "reset":
      clearInterval(timerInterval);
      timerInterval = null;
      seconds = 0;
      document.getElementById("timer").textContent = "00:00";
      break;
    case "gameOver":
      document.getElementById("timer").textContent = getTime();
      break;
  }
};