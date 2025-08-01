import { loadStartScreen } from "./src/startscreen.js";

const body = document.getElementsByTagName("body");

const location = ["Dunningen", "Peking", "New York"];

loadStartScreen(location);

document.addEventListener("DOMContentLoaded", (event) => {
  console.log(document.getElementById("Dunningen"));
});
