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

	static getWinningMoves(grid, symbol, symbolOther) {
		let validMoves = this.getValidMoves(grid);

		// if 1st to go, put it in the corner
		if (validMoves.length === 9) {
			return { row: 2, col: 2 };
		}

		// if 2nd to go or 2nd round, try to place move in middle, if can't, place across 1st move
		if (validMoves.length === 8 || validMoves.length === 7) {
			if (grid[1][1] === ' ') return { row: 1, col: 1 };
			if (grid[1][1] === symbolOther) return { row: 0, col: 0 };
		}
	}

	static getSmartMove(grid, symbol) {
		// ! HA: why does this import have to be inside of this method, not in the global space?
		const TTT = require('./ttt');

		let validMoves = this.getValidMoves(grid);

		let symbolOther = 'O';
		if (symbol === 'O') symbolOther = 'X';

		// check winning moves first
		let winningMove = this.getWinningMoves(grid, symbol, symbolOther);
		if (winningMove !== undefined) return winningMove;

		// get smart moves
		// test current symbol first and then opponent's
		for (const each of [symbol, symbolOther]) {
			// check each valid move
			for (let i = 0; i < validMoves.length; i++) {
				let move = validMoves[i];
				grid[move.row][move.col] = each;

				if (TTT.checkWin(grid) === each) {
					grid[move.row][move.col] = ' ';
					return move;
				}

				grid[move.row][move.col] = ' ';
			}
		}

		// try to put in corners
		if (grid[0][0] === ' ') return { row: 0, col: 0 };
		if (grid[2][2] === ' ') return { row: 2, col: 2 };
		if (grid[0][2] === ' ') return { row: 0, col: 2 };
		if (grid[2][0] === ' ') return { row: 2, col: 0 };

		// try to put in middle
		if (grid[1][1] === ' ') return { row: 1, col: 1 };

		return ComputerPlayer.randomMove(grid);
	}
}

module.exports = ComputerPlayer;
