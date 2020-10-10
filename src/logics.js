let theCounter = 0;

const chooseNextOne = (sqArray) => {
	const squares = sqArray.squares;

	const winConditions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	// null squares - x squares and o squares
	const nSquares = [];
	const xSquares = [];
	const oSquares = [];

	// corner squares are better normally
	const cornerSquares = [0, 2, 6, 8];
	const sideSquares = [1, 3, 5, 7];
	const xSideSquares = [
		[0, 8],
		[2, 6],
	];

	squares.forEach((item, index) => {
		if (item === null) nSquares.push(index);
		if (item === "X") xSquares.push(index);
		if (item === "O") oSquares.push(index);
	});

	// if it's the first move, choose the best place center or corner
	if (xSquares.length === 1) {
		return !xSquares.includes(4)
			? 4
			: cornerSquares[Math.floor(Math.random() * 3)];
	}

	if (xSquares.length === 2) {
		return nextBestMove(sqArray);
	}

	//prevent 2 ways if o is centered and Xes are on two opposite corners
	if (xSquares.length === 2) {
		if (
			xSideSquares.some((xSide) =>
				xSide.every((item) => xSquares.includes(item))
			)
		)
			return sideSquares[Math.floor(Math.random() * 3)];
	}

	// find available winning conditions (not any x in row)
	//  then check for two O in a row for immediate winner move!
	const availableWinConditions = winConditions
		.filter((item) => !item.some((x) => xSquares.includes(x)))
		.filter(
			(winCondition) =>
				winCondition.filter((item) => oSquares.includes(item)).length === 2
		);

	// find the empty one in immediate win condition
	if (availableWinConditions.length) {
		return availableWinConditions[0].find((item) => nSquares.includes(item));
	}

	// prevent loss and fill the opponent winning button
	// includes X but not any O
	const preventLoss = winConditions
		.filter(
			(item) =>
				item.some((x) => xSquares.includes(x)) &&
				!item.some((x) => oSquares.includes(x))
		)
		.filter(
			(lossCondition) =>
				lossCondition.filter((item) => xSquares.includes(item)).length === 2
		);

	if (preventLoss.length) {
		return preventLoss[0].find((item) => nSquares.includes(item));
	}

	// always put in corners if any is available
	const availableCornerSquares = cornerSquares.filter((item) =>
		nSquares.includes(item)
	);
	if (availableCornerSquares.length)
		return availableCornerSquares[
			Math.floor(Math.random() * availableCornerSquares.length)
		];

	// return a random item (level 1)
	return nSquares[Math.floor(Math.random() * (nSquares.length - 1))];
};

// duplicate passed board and return the new board state
const makeAIMove = (currentBoard, square, player) => {
	const nextBoard = [...currentBoard];
	nextBoard[square] = player;
	return nextBoard;
};

// find empty squares
const emptySquares = (sqBoard) =>
	sqBoard
		.map((sq, idx) => (sq === null ? idx : null))
		.filter((sq) => sq !== null);

// check if no empty squares are available
const isFinished = (sqBoard) => (emptySquares(sqBoard).length ? false : true);

// minimax algorithm
const minimax = (sqBoard, depth, isMaximizer) => {
	theCounter++;
	// terminal checker
	const theWinner = checkWinner(sqBoard);
	// we have a winner
	if (theWinner) {
		return theWinner === "X" ? -10 : 10;
	}
	// it's a tie
	if (isFinished(sqBoard)) {
		return 0;
	}

	let bestScore;
	if (isMaximizer) {
		bestScore = -1000;
		emptySquares(sqBoard).forEach((square) => {
			// make a sample move
			let nextBoard = makeAIMove(sqBoard, square, "O");

			// recursion
			let score = minimax(nextBoard, depth + 1, false);
			bestScore = Math.max(bestScore, score);
		});
	} else {
		bestScore = 1000;
		emptySquares(sqBoard).forEach((square) => {
			let nextBoard = makeAIMove(sqBoard, square, "X");
			let score = minimax(nextBoard, depth + 1, true);
			bestScore = Math.min(bestScore, score);
		});
	}
	return bestScore;
};

// find the best move
const nextBestMove = (sqBoard) => {
	console.log(theCounter);
	sqBoard = sqBoard.squares;
	let nextMoveArray = [];
	let remainedSquares = emptySquares(sqBoard);
	if (remainedSquares.length) {
		remainedSquares.forEach((square) => {
			let nextBoard = makeAIMove(sqBoard, square, "O");
			let theScore = minimax(nextBoard, 0, false);
			nextMoveArray.push({
				sq: square,
				sc: theScore,
			});
		});

		const nextMoveSorted = nextMoveArray.sort((a, b) => (a.sc < b.sc ? 1 : -1));
		return nextMoveSorted[0].sq;
	}
};

const checkWinner = (sqArray) => {
	const winConditions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const winCondition of winConditions) {
		const [b1, b2, b3] = winCondition;
		if (
			sqArray[b1] &&
			sqArray[b1] === sqArray[b2] &&
			sqArray[b1] === sqArray[b3]
		)
			return sqArray[b1];
	}

	return false;
};

export { chooseNextOne, checkWinner };
