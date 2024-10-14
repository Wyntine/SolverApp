export function getAllTableElements(): HTMLTableCellElement[] {
  return Array.from(document.getElementsByTagName("tr"))
    .toReversed()
    .map((item) => Array.from(item.childNodes))
    .flatMap((item) => item) as HTMLTableCellElement[];
}

export function getCells(): HTMLTableCellElement[] {
  return getAllTableElements().filter((item) =>
    item.classList.contains("cell")
  );
}

export function getLineBorders(): HTMLTableCellElement[] {
  return getAllTableElements().filter((item) =>
    ["vertBorder", "horzBorder"].find(
      (type) =>
        item.classList.contains(type) && !item.classList.contains("pointBorder")
    )
  );
}

export function getPointBorders(): HTMLTableCellElement[] {
  return getAllTableElements().filter((item) =>
    item.classList.contains("pointBorder")
  );
}

export function clear(): void {
  getCells().forEach((cell) => (cell.textContent = ""));
}
