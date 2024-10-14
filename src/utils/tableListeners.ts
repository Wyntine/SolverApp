import { Solver } from "../app/classes/solver.js";
import { convertToCellCoordinates } from "../app/utils/solver.js";
import {
  getConnectedPoints,
  getElement,
  getElementCoordinates,
} from "./elements.js";
import { getCells, getLineBorders } from "./table.js";

export function cellNumberListener(event: KeyboardEvent) {
  const cell = event.target as HTMLTableCellElement;
  const value = cell.textContent ?? "";
  const numberValue = parseInt(event.key);

  if (
    value.length >= 1 ||
    !Number.isSafeInteger(numberValue) ||
    numberValue <= 0
  ) {
    event.preventDefault();
    return;
  }
}

export function borderClickListener(event: MouseEvent) {
  const border = event.target as HTMLTableCellElement;

  if (border.classList.contains("groupBorder")) {
    border.classList.remove("groupBorder");
  } else {
    border.classList.add("groupBorder");
  }

  const points = getConnectedPoints(border);

  points.forEach((point) => {
    const { x, y } = getElementCoordinates(point);
    const borders = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ].filter((position) =>
      getElement(position)?.classList.contains("groupBorder"),
    );
    if (borders.length >= 2) {
      point.classList.add("groupBorder");
    } else {
      point.classList.remove("groupBorder");
    }
  });
}

export async function solve() {
  const columnsInput = document.getElementById("columns") as HTMLInputElement;
  const rowsInput = document.getElementById("rows") as HTMLInputElement;
  const logEnabledInput = document.getElementById(
    "logCheckbox",
  ) as HTMLInputElement;
  const waitTimeInput = document.getElementById("waitTime") as HTMLInputElement;

  const columns = parseInt(columnsInput.value);
  const lines = parseInt(rowsInput.value);
  const logEnabled = logEnabledInput.checked;
  const waitTime = parseInt(waitTimeInput.value);

  const solver = new Solver({ columns, lines, waitTime, log: logEnabled });
  const cells = getCells();
  const walls = getLineBorders();

  cells.forEach((cell) => {
    const coords = getElementCoordinates(cell);
    const cellPosition = convertToCellCoordinates(coords);

    if (cell.textContent) {
      solver.setCellValue(cellPosition, parseInt(cell.textContent));
    }
  });

  walls.forEach((border) => {
    const position = getElementCoordinates(border);
    const groupCheck = border.classList.contains("groupBorder");

    if (groupCheck) {
      solver.setGroupBorder(position, true);
    }
  });

  await solver.solve();
  const items = solver.table.getCells();

  items.forEach((cell) => {
    const element = getElement(cell.getPosition());

    if (!element) return;

    element.textContent = (cell.getValue() ?? "").toString();
  });
}
