import { Logger } from "../classes/logger.js";
import { Messages } from "../classes/messages.js";

// export function inputChecker<Inputs extends [unknown, string][]>(
//   inputs: Inputs,
//   logger: Logger,
//   messages: Messages,
//   statement: (input: unknown) => boolean
// ): void {
//   for (const [input, message] of inputs) {
//     if (statement(input)) continue;

//     throw logger.createError(messages.getErrorMessage(message));
//   }
// }

export function inputChecker(
  inputs: [unknown, string][],
  logger: Logger,
  messages: Messages,
  statement: (input: unknown) => boolean,
): void {
  for (const [input, message] of inputs) {
    if (statement(input)) continue;

    throw logger.createError(messages.getErrorMessage(message));
  }
}
