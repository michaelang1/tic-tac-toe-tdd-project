class ComputerPlayer {
	static getValidMoves(grid) {
		let validMoves = [];

		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[0].length; col++) {
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

	// static getWinningMoves(grid, symbol) {}

	static getSmartMove(grid, symbol) {
		// ! HA: why does this import have to be inside of this method, not in the global space?
		const TTT = require('./ttt');

		let validMoves = this.getValidMoves(grid);
		let symbolOther = 'O';
		if (symbol === 'O') symbolOther = 'X';

		// check if ai is making the first move, put it in the corner
		let countEmpty = 0;
		for (const row of grid) {
			for (const el of row) {
				if (el === ' ') countEmpty++;
			}
		}
		if (countEmpty === 9) {
			return { row: 0, col: 0 };
		}

		// test ai's symbol first then opponent's
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

		return ComputerPlayer.randomMove(grid);
	}
}

module.exports = ComputerPlayer;
