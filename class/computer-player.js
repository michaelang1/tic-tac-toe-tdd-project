class ComputerPlayer {
	static getValidMoves(grid) {
		let validMoves = [];

		for (let row = 0; row <= 2; row++) {
			for (let col = 0; col <= 2; col++) {
				if (grid[row][col] === ' ') {
					validMoves.push({ row: row, col: col });
				}
			}
		}

		return validMoves;
	}

	static randomMove(grid) {
		let validMoves = this.getValidMoves(grid);
		let min = 0;
		let max = validMoves.length;
		let randomIndex = Math.floor(Math.random() * (max - min) + min);
		return validMoves[randomIndex];
	}

	static getWinningMoves(grid, symbol) {
		// ! HA: why does this import have to be inside of this method, not in the global space?
		const TTT = require('./ttt');

		// test current player first and then opponent to see if there is
		// an immediate win, if yes, choose that move for the current player
		let symbolOther = 'O';
		if (symbol === 'O') symbolOther = 'X';

		let validMoves = this.getValidMoves(grid);

		for (const each of [symbol, symbolOther]) {
			// check each valid move
			for (const move of validMoves) {
				grid[move.row][move.col] = each;

				if (TTT.checkWin(grid) === each) {
					grid[move.row][move.col] = ' ';
					return move;
				}

				// revert back the board
				grid[move.row][move.col] = ' ';
			}
		}
	}

	static getSmartMove(grid, symbol) {
		// first check if there is a winning move:
		// Minimax has trouble finding the immediate winning or winning-blocking
		// move if when both parties play intelligently
		// the game's ending has been fixed
		let winningMove = this.getWinningMoves(grid, symbol);
		if (winningMove) return winningMove;

		// run minimax program
		if (symbol === 'X') {
			return this.maxValue(grid, 'X', 'O').bestMove;
		} else {
			return this.minValue(grid, 'O', 'X').bestMove;
		}
	}

	static maxValue(grid, currSymbol, nextSymbol, LowerPruneLimit) {
		// ! HA: why does this import have to be inside of this method, not in the global space?
		const TTT = require('./ttt');

		// if game ends, return end result (winner or tie), base case
		let winner = TTT.checkWin(grid);
		if (winner === 'X') {
			return { v: 1 };
		} else if (winner === 'O') {
			return { v: -1 };
		} else if (winner === 'T') {
			return { v: 0 };
		}

		let v = -100000;
		let bestMove;
		let validMoves = this.getValidMoves(grid);

		// test each move
		for (const move of validMoves) {
			// deep copy the current grid so as to not modify it
			let gridTrial = grid.map(row => row.map(el => el));
			// place the move
			gridTrial[move.row][move.col] = currSymbol;

			// get the max of the min value of the new grid, and the associated move
			let v2 = this.minValue(gridTrial, nextSymbol, currSymbol, v).v;

			// Alpha-beta pruning
			// stops current loop, drops the rest of the sub-nodes,
			// and moves onto the next node
			if (v2 >= LowerPruneLimit) {
				v = v2;
				break;
			} else if (v2 > v) {
				v = v2;
				bestMove = move;
			}
		}
		return { v: v, bestMove: bestMove };
	}

	static minValue(grid, currSymbol, nextSymbol, UpperPruneLimit) {
		// ! HA: why does this import have to be inside of this method, not in the global space?
		const TTT = require('./ttt');

		// if game ends, return end result (winner or tie), base case
		let winner = TTT.checkWin(grid);
		if (winner === 'X') {
			return { v: 1 };
		} else if (winner === 'O') {
			return { v: -1 };
		} else if (winner === 'T') {
			return { v: 0 };
		}

		let v = 100000;
		let bestMove;
		let validMoves = this.getValidMoves(grid);

		// test each move
		for (const move of validMoves) {
			// deep copy the current grid so as to not modify it
			let gridTrial = grid.map(row => row.map(el => el));
			// place the move
			gridTrial[move.row][move.col] = currSymbol;

			// get the min of the max value of the new grid, and the associated move
			let v2 = this.maxValue(gridTrial, nextSymbol, currSymbol, v).v;

			// Alpha-beta pruning
			// stops current loop, drops the rest of the sub-nodes,
			// and moves onto the next node
			if (v2 <= UpperPruneLimit) {
				v = v2;
				break;
			} else if (v2 < v) {
				v = v2;
				bestMove = move;
			}
		}
		return { v: v, bestMove: bestMove };
	}
}

module.exports = ComputerPlayer;
