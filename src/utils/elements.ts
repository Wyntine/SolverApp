import { Position } from "../app/types.js";
import { getAllTableElements } from "./table.js";

export function getElementCoordinates(element: HTMLTableCellElement): Position {
  return {
    x: parseInt(element.getAttribute("x") ?? "0"),
    y: parseInt(element.getAttribute("y") ?? "0"),
  };
}

export function getElement(
  position: Position
): HTMLTableCellElement | undefined {
  return getAllTableElements().find((element) => {
    const { x, y } = getElementCoordinates(element);
    return x === position.x && y === position.y;
  });
}

export function getConnectedPoints(
  border: HTMLTableCellElement
): HTMLTableCellElement[] {
  const { x, y } = getElementCoordinates(border);

  const isHorizontal = border.classList.contains("horzBorder");
  const isVertical = border.classList.contains("vertBorder");

  if (!isHorizontal && !isVertical) {
    throw new Error("This is not a line border.");
  }

  const xDiff = isHorizontal ? 1 : 0;
  const yDiff = isVertical ? 1 : 0;

  return [
    { x: x + xDiff, y: y + yDiff },
    { x: x - xDiff, y: y - yDiff },
  ]
    .map((position) => getElement(position))
    .filter((element) => element) as HTMLTableCellElement[];
}
