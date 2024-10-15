# Suguru Solver

Suguru Solver is a portable application written in TypeScript and Electron. It allows users to generate, edit, and solve Suguru puzzles. Users can interact with the grid by clicking on the boundaries to add or remove borders and by clicking on the cells to set the initial numbers of the puzzle. It can also log the steps to help you debug the algorithm.

# Example

![Image](https://raw.githubusercontent.com/Wyntine/assets/refs/heads/main/solver/menu.png)

## Algorithm Overview

The solver uses a group based algorithm to handle Suguru puzzles. The algorithm follows these key steps:

1. **Group Assignment**: Each cell in the grid is assigned to a group based on the connected cells within its boundary. A unique group ID is given to each connected region.

2. **Value Elimination**: For each empty cell, the solver checks nearby cells and its own group and eliminates possible values based on the numbers already present in the group or adjacent cells.

3. **Single Value Detection**: If a cell has only one possible value remaining, that value is assigned to the cell. If no single value exists, a backup strategy is used to select a random empty cell and value and continue the process.

4. **Backup and Retry**: If the solver encounters an unsolvable state, it loads the previous backup and attempts a different value assignment. This process repeats until the puzzle is fully solved.

5. **Termination**: The algorithm terminates successfully when all cells have been filled with valid values without conflicts in the groups or adjacent cells and displays them to the screen.

The algorithm efficiently solves the puzzle by iteratively refining possible values and backing up the state when necessary.

## Installation and Build

To run this project locally, follow these steps:

### Prerequisites

- Node.js
- TypeScript
- Electron

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Wyntine/SolverApp.git
   cd SolverApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Build and Run

To build and run the project, use the following commands:

- **Start the Application:**

  ```bash
  npm start
  ```

- **Build for Production:**
  ```bash
  npm run build
  ```

This will create an executable version of the Suguru Solver for the operating system that you are using.
