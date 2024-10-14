import { generalLogger, generalMessages } from "./systemMessages.js";

export function getRandomItem<Type>(array: Type[]): Type {
  const index = Math.floor(Math.random() * array.length - 1);
  const item = array.at(index);

  if (!item)
    throw generalLogger.createError(
      generalMessages.getErrorMessage("invalidArrayItem"),
      index
    );

  return item;
}
