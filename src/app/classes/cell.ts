import { CellOptions, UUID } from "../types.js";
import { inputChecker } from "../utils/inputChecker.js";
import { isNaturalInteger } from "../utils/numbers.js";
import { generalMessages } from "../utils/systemMessages.js";
import { Axis } from "./axis.js";
import { Logger } from "./logger.js";
import { Point } from "./point.js";
import { Wall } from "./wall.js";

export class Cell extends Axis {
  private value?: number | undefined;
  private logger: Logger;
  private groupId?: string;
  private possibleValues = new Set<number>();

  constructor({ x, y, value }: CellOptions) {
    const logger = new Logger("Cell");

    super({ x, y, logger });

    inputChecker(
      [[value, "invalidNumberValue"]],
      logger,
      generalMessages,
      (input) => (input === undefined ? true : isNaturalInteger(input))
    );

    this.logger = logger;
    if (value) this.value = value;
  }

  public addPossibleValues(...values: number[]): this {
    values.forEach((value) => this.possibleValues.add(value));
    return this;
  }

  public removePossibleValues(...values: number[]): this {
    values.forEach((value) => this.possibleValues.delete(value));
    return this;
  }

  public hasPossibleValue(value: number): boolean {
    return this.possibleValues.has(value);
  }

  public getIfOnlyOnePossibleValueExists(): number | undefined {
    if (this.possibleValues.size === 1)
      return Array.from(this.possibleValues).at(0);
    return undefined;
  }

  public getPossibleValues(): number[] {
    return Array.from(this.possibleValues);
  }

  public resetPossibleValues(): this {
    this.possibleValues = new Set();
    return this;
  }

  public getValue(): number | undefined {
    return this.value;
  }

  public getGroupId<Force extends boolean = false>(
    force?: Force
  ): Force extends true ? UUID : UUID | undefined {
    if (force && !this.groupId)
      throw this.logger.createError(
        generalMessages.getErrorMessage("groupIdInvalid")
      );
    return this.groupId as Force extends true ? UUID : UUID | undefined;
  }

  public setGroupId(groupId?: string): this {
    if (groupId) this.groupId = groupId;
    return this;
  }

  public setValue(value?: number): this {
    if (typeof value !== "number") {
      this.value = value;
      return this;
    }

    if (!isNaturalInteger(value)) {
      throw this.logger.createError(
        generalMessages.getErrorMessage("invalidNumberValue"),
        value
      );
    }

    this.value = value;
    return this;
  }

  public hasValue(): boolean {
    return this.value !== undefined;
  }

  public isCell(): this is Cell {
    return true;
  }

  public isPoint(): this is Point {
    return false;
  }

  public isWall(): this is Wall {
    return false;
  }
}
