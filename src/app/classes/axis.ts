import { AxisOptions, Position } from "../types.js";
import { inputChecker } from "../utils/inputChecker.js";
import { isNaturalInteger } from "../utils/numbers.js";
import { convertToCellCoordinates } from "../utils/solver.js";
import { generalMessages } from "../utils/systemMessages.js";

export class Axis {
  private x: number;
  private y: number;

  constructor({ x, y, logger }: AxisOptions) {
    inputChecker(
      [
        [x, "invalidX"],
        [y, "invalidY"],
      ],
      logger,
      generalMessages,
      isNaturalInteger
    );

    this.x = x;
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getPosition(): Position {
    return {
      x: this.getX(),
      y: this.getY(),
    };
  }

  public getCellPosition(): Position {
    return convertToCellCoordinates({ x: this.getX(), y: this.getY() });
  }
}
