const Screen = require('./screen');
const Cursor = require('./cursor');
const ComputerPlayer = require('./computer-player');

class TTT {
	constructor() {
		this.playerTurn = 'O';

		this.grid = [
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
		];

		this.move = 'O';

		this.cursor = new Cursor(3, 3);

		// Initialize a 3x3 tic-tac-toe grid
		Screen.initialize(3, 3);
		Screen.setGridlines(true);

		// Replace this with real commands
		Screen.addCommand('up', 'up', this.cursor.up.bind(this.cursor));
		Screen.addCommand('left', 'left', this.cursor.left.bind(this.cursor));
		Screen.addCommand(
			'right',
			'right',
			this.cursor.right.bind(this.cursor)
		);
		Screen.addCommand('down', 'down', this.cursor.down.bind(this.cursor));
		Screen.addCommand('space', 'place a move', this.placeMove.bind(this));

		// set initial highlight at 0, 0 location
		this.cursor.setBackgroundColor();
		Screen.render();

		// print commands upon starting the game
		Screen.printCommands();
	}

	placeMove() {
		// put down move at cursor
		let row = this.cursor.row;
		let col = this.cursor.col;

		Screen.setGrid(row, col, this.move);
		Screen.render();

		// change move for the next time
		if (this.move === 'O') {
			this.move = 'X';
		} else {
			this.move = 'O';
		}

		// check the status
		let winner = TTT.checkWin(Screen.grid);

		// end game if should
		if (winner !== false) TTT.endGame(winner);

		this.aiPlaceMove();
	}

	aiPlaceMove() {
		// call AI to place move
		let smartMove = ComputerPlayer.getSmartMove(Screen.grid, this.move);

		let row = smartMove.row;
		let col = smartMove.col;
		Screen.setGrid(row, col, this.move);
		Screen.render();

		// change move for the next time
		if (this.move === 'O') {
			this.move = 'X';
		} else {
			this.move = 'O';
		}

		// check the status
		let winner = TTT.checkWin(Screen.grid);

		// end game if should
		if (winner !== false) TTT.endGame(winner);
	}

	static checkWin(grid) {
		// define check array helper function
		const checkArrSame = arr => {
			// Return 'X' if player X wins
			// Return 'O' if player O wins
			if (
				arr[0] !== ' ' &&
				arr.filter(el => el !== arr[0]).length === 0
			) {
				return arr[0];
			}
		};

		// 1. check each row
		for (const row of grid) {
			let winner = checkArrSame(row);
			if (winner !== undefined) return winner;
		}

		// 2. check each column
		for (let col = 0; col < 3; col++) {
			let tempCol = [];
			for (const row of grid) {
				tempCol.push(row[col]);
			}
			let winner = checkArrSame(tempCol);
			if (winner !== undefined) return winner;
		}

		// 3. check each diagonal
		for (const i of [0, 2]) {
			let tempDiag = [];
			let col = 0;

			for (let row = 0; row < 3; row++) {
				if (i === 0) {
					col = row;
				} else {
					col = i - row;
				}
				tempDiag.push(grid[row][col]);
			}

			let winner = checkArrSame(tempDiag);
			if (winner !== undefined) return winner;
		}

		// Return false if the game has not ended (i.e. with empty cells)
		for (const row of grid) {
			for (const el of row) {
				if (el === ' ') return false;
			}
		}

		// Return 'T' if the game is a tie
		return 'T';
	}

	static endGame(winner) {
		if (winner === 'O' || winner === 'X') {
			Screen.setQuitMessage(`Player ${winner} wins!`);
		} else if (winner === 'T') {
			Screen.setQuitMessage(`Tie game!`);
		} else {
			Screen.setQuitMessage(`Game Over`);
		}
		Screen.quit();
		Screen.render();
	}
}

module.exports = TTT;
