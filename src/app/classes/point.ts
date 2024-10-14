import { Position } from "../types.js";
import { Axis } from "./axis.js";
import { Cell } from "./cell.js";
import { Logger } from "./logger.js";
import { Wall } from "./wall.js";

export class Point extends Axis {
  // private logger = new Logger("Point");

  constructor({ x, y }: Position) {
    const logger = new Logger("Point");

    super({ x, y, logger });
  }

  public isCell(): this is Cell {
    return false;
  }

  public isPoint(): this is Point {
    return true;
  }

  public isWall(): this is Wall {
    return false;
  }
}
