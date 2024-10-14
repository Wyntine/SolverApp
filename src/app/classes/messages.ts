import { StringRecord } from "../types.js";
import { Logger } from "./logger.js";

const messages = {
  general: {
    errors: {
      invalidX: "Invalid X position:",
      invalidY: "Invalid Y position:",
      invalidNumberValue: "Invalid number value:",
      groupIdInvalid: "Group ID cannot be undefined.",
      invalidArrayItem: "Could not find an item on given array index:",
    },
  },

  table: {
    errors: {
      invalidColumns: "Invalid column length:",
      invalidLines: "Invalid line length:",
      cellOutOfBounds: "Given cell position is out of bounds:",
      objectOutOfBounds: "Given object position is out of bounds:",
      notFound: "Selected item is not found:",
      notWall: "Selected item is not a Wall:",
      notCell: "Selected item is not a Cell:",
    },
  },
} as Record<string, StringRecord>;

export class Messages {
  private data: StringRecord;
  private category: string;

  private logger = new Logger("Messages");

  constructor(categoryName: string) {
    const dataValue = messages[categoryName];

    if (!dataValue) {
      throw this.logger.createError(
        `Given category name '${categoryName}' is invalid.`
      );
    }

    this.category = categoryName;
    this.data = dataValue;
  }

  public getErrorMessage(messageName: string): string {
    const errorData = this.data["errors"];

    if (
      !errorData ||
      typeof errorData !== "object" ||
      Array.isArray(errorData)
    ) {
      throw this.logger.createError(
        `Given category '${this.category}' does not have an object named 'errors'.`
      );
    }

    const message = errorData[messageName as keyof typeof errorData];

    if (typeof message !== "string") {
      throw this.logger.createError(
        `Given category '${this.category}' does not have string named '${messageName}' in errors.`
      );
    }

    return message;
  }
}
