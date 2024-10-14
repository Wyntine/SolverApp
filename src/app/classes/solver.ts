import { Directions, Position, SolverOptions } from "../types.js";
import { Table } from "./table.js";
import { lengthArray } from "../utils/numbers.js";
import { Backup } from "./backup.js";
import { coordinateString, filterGroups } from "../utils/solver.js";
import { getRandomItem } from "../utils/arrays.js";
import { wait } from "../utils/object.js";
import { Messages } from "./messages.js";
import { Logger } from "./logger.js";

export class Solver {
  private logEnabled: boolean;
  private waitTime: number;

  public table: Table;

  private logger = new Logger("Solver");
  private tableMessages = new Messages("table");

  constructor({ columns, lines, log, waitTime }: SolverOptions) {
    this.waitTime = waitTime ?? 0;
    this.logEnabled = log ?? false;
    this.table = new Table({ columns, lines });
  }

  public async solve() {
    this.setGroups();

    let lastAttempts = 0;
    const backup = new Backup();

    let totalSteps = 0;
    let firstBackup = false;
    let backupPending = false;
    const lastData = new Backup();
    const timeStart = Date.now();

    while (true as boolean) {
      const cells = this.table.getCells();
      this.log("-".repeat(30));
      const groups = Object.values(filterGroups(cells));

      lastData.setBackup(cells);

      for (const cells of groups) {
        for (const cell of cells) {
          const cellValue = cell.getValue();
          const nearbyCells = this.table.getNearbyCells(cell.getCellPosition());
          const allCells = cells
            .concat(...nearbyCells)
            .filter((cell, index, array) => array.indexOf(cell) === index);

          if (cellValue) {
            allCells.forEach((cell) => cell.removePossibleValues(cellValue));
            cell.resetPossibleValues();
            continue;
          }

          const deletedNumbers = allCells
            .map((cell) => cell.getValue())
            .filter((value) => value) as number[];
          const groupLengthArray = lengthArray(cells);
          const lastValues = groupLengthArray.filter(
            (number) => !deletedNumbers.includes(number),
          );
          cell.addPossibleValues(...lastValues);
        }
      }

      for (const cell of cells) {
        const groupCells = this.table
          .getCellGroup(cell.getGroupId(true))
          .filter((_, i, array) => array.indexOf(cell) !== i);
        const nearbyCells = this.table.getNearbyCells(cell.getCellPosition());
        const reachableCells = [...groupCells, ...nearbyCells];

        const onlyNumber =
          cell.getIfOnlyOnePossibleValueExists() ??
          cell
            .getPossibleValues()
            .find(
              (number) =>
                !groupCells.find((cell) => cell.hasPossibleValue(number)),
            );

        const value = cell.getValue();

        if (value) {
          reachableCells.forEach((cell) => cell.removePossibleValues(value));
          continue;
        }

        if (onlyNumber) {
          reachableCells.forEach((cell) =>
            cell.removePossibleValues(onlyNumber),
          );
          cell.setValue(onlyNumber);
          cell.resetPossibleValues();
          continue;
        }
      }

      if (backupPending) {
        const emptyCells = cells.filter((cell) => !cell.hasValue());

        if (emptyCells.length) {
          let cellAttempts = 0;

          while (true as boolean) {
            if (cellAttempts >= 10) break;

            const emptyCell = getRandomItem(emptyCells);

            if (!emptyCell.getPossibleValues().length) {
              this.log("Invalid input.");
              cellAttempts++;
              continue;
            }

            emptyCell
              .setValue(getRandomItem(emptyCell.getPossibleValues()))
              .removePossibleValues();
            break;
          }
        } else {
          this.log("No empty cell left.");
        }

        backupPending = false;
      }

      let checkFailed = false;

      if (cells.every((cell) => cell.hasValue())) {
        const lastCheck = cells.every((cell) => {
          const groupCells = this.table
            .getCellGroup(cell.getGroupId(true))
            .filter((_, i, array) => array.indexOf(cell) !== i);
          const nearbyCells = this.table.getNearbyCells(cell.getCellPosition());
          const reachableCells = [...groupCells, ...nearbyCells];

          return !reachableCells.find((c) => c.getValue() === cell.getValue());
        });

        if (lastCheck) {
          this.log(this.table.print());
          const timeEnd = Date.now();
          this.log("Finished!", `${(timeEnd - timeStart).toString()} ms`);
          break;
        } else {
          checkFailed = true;
        }
      }

      const cellCheckFailed = !!cells.find(
        (cell) => !cell.hasValue() && !cell.getPossibleValues().length,
      );

      if (cellCheckFailed || checkFailed) {
        backup.useBackup(this.table);
        this.log("Previous backup loaded.");
        backupPending = true;
      }

      if (lastAttempts >= 2) {
        if (!firstBackup && !cellCheckFailed && !checkFailed) {
          backup.setBackup(cells);
          firstBackup = true;
          this.log("Backed up current game status.");
        }

        backupPending = true;
      }

      totalSteps++;

      this.log(
        `Steps: ${totalSteps.toString()}, Attempts: ${lastAttempts.toString()}`,
      );
      this.log(this.table.print());

      lastAttempts = backupPending
        ? 0
        : lastData.isBackupEqual(cells)
        ? lastAttempts + 1
        : 0;

      if (this.waitTime) await wait(this.waitTime);
    }
  }

  public setCellValue(cellPosition: Position, value?: number): this {
    const cell = this.table.getCell(cellPosition);
    cell.setValue(value);
    return this;
  }

  public addGroupBorders(
    cellPosition: Position,
    addedWalls?: Directions[],
  ): this {
    const walls = this.table.getWalls(cellPosition);
    const directions = addedWalls
      ? Array.from(new Set(addedWalls))
      : (["up", "down", "right", "left"] as const);
    directions.forEach((direction) => walls[direction].setGroupBorder(true));
    return this;
  }

  public setGroupBorder(position: Position, borderEnabled = true): this {
    const border = this.table.getItem(position);

    if (!border.isWall()) {
      throw this.logger.createError(
        this.tableMessages.getErrorMessage("notWall"),
        coordinateString(position),
      );
    }

    border.setGroupBorder(borderEnabled);
    return this;
  }

  private setGroups(): void {
    let groupId = crypto.randomUUID();
    const tableCells = this.table.getCells();

    for (const cell of tableCells) {
      const cells = this.table.getAvailableCells(cell.getCellPosition());
      const cellMap = Object.values(cells);

      if (!cells.left) groupId = crypto.randomUUID();

      cell.setGroupId(groupId);

      for (const nearbyCell of cellMap) {
        const cellGroupID = nearbyCell.getGroupId();

        if (!cellGroupID) {
          nearbyCell.setGroupId(groupId);
          continue;
        }

        tableCells
          .filter((c) => c.getGroupId() === groupId)
          .forEach((c) => c.setGroupId(cellGroupID));

        groupId = cellGroupID;
      }
    }
  }

  private log(...messages: unknown[]): void {
    if (this.logEnabled) console.log(...messages);
  }
}
