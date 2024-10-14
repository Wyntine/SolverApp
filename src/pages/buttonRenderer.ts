import { clear } from "../utils/table.js";
import { solve } from "../utils/tableListeners.js";
import { createTable } from "./menu.js";

const buttonList = [
  ["createButton", createTable],
  ["clearButton", clear],
  ["solveButton", solve],
] as const;

document.addEventListener("DOMContentLoaded", () => {
  for (const [id, func] of buttonList) {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", () => void func());

    if (id === "createButton") createTable();
  }
});
