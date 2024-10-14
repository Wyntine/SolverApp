import { isOdd } from "../app/utils/numbers.js";
import { getLineBorders, getCells } from "../utils/table.js";
import {
  borderClickListener,
  cellNumberListener,
} from "../utils/tableListeners.js";

export function createTable() {
  const columnsInput = document.getElementById("columns") as HTMLInputElement;
  const rowsInput = document.getElementById("rows") as HTMLInputElement;

  getLineBorders().forEach((item) => {
    item.removeEventListener("click", borderClickListener);
  });

  getCells().forEach((item) => {
    item.removeEventListener("keypress", cellNumberListener);
  });

  const columns = parseInt(columnsInput.value) * 2 + 1;
  const rows = parseInt(rowsInput.value) * 2 + 1;

  let tableHTML = "";

  for (let i = 0; i < rows; i++) {
    const rowNumber = (rows - 1 - i).toString();
    tableHTML += `<tr y=${rowNumber}>`;

    for (let j = 0; j < columns; j++) {
      tableHTML += `<td x="${j.toString()}" y="${rowNumber}"></td>`;
    }

    tableHTML += "</tr>";
  }

  const table = document.getElementById("clickableTable");

  if (table) {
    table.innerHTML = tableHTML;
    let currentRow: HTMLTableCellElement[] = [];

    const items = Array.from(table.getElementsByTagName("td")).reduce<
      HTMLTableCellElement[][]
    >((total, item, index, array) => {
      const length = index + 1;
      if (index !== 0 && (length % columns === 0 || length === array.length)) {
        const finalRow = [...currentRow, item];
        currentRow = [];
        return [...total, finalRow];
      }

      currentRow.push(item);

      return total;
    }, []);

    items.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        const groupBorderValue =
          rowIndex === 0 ||
          rowIndex + 1 === items.length ||
          columnIndex === 0 ||
          columnIndex + 1 === row.length
            ? ["groupBorder", "noHover"]
            : [undefined];

        const borderValue = isOdd(rowIndex)
          ? isOdd(columnIndex)
            ? ["pointBorder", "noHover"]
            : ["horzBorder"]
          : isOdd(columnIndex)
          ? ["vertBorder"]
          : ["cell"];

        const addedValues = [...borderValue, ...groupBorderValue].filter(
          (value) => value !== undefined,
        );

        column.classList.add(...addedValues);

        if (addedValues.includes("cell")) {
          column.contentEditable = "true";
        }
      });
    });

    getLineBorders().forEach((item) => {
      item.addEventListener("click", borderClickListener);
    });

    getCells().forEach((item) => {
      item.addEventListener("keypress", cellNumberListener);
    });
  }
}
