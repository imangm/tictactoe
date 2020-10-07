import React, { useEffect, useState } from "react";
import { Squares } from "./squares";
import { StatusBar } from "./statusbar";
import { GameMode } from "./gamemode";
import { History } from "./history";

export const Board = (props) => {
	const [history, setHistory] = useState([]);
	const [buttons, setButtons] = useState({
		nextVal: "X",
		squares: new Array(9).fill(null),
	});
	const [winner, setWinner] = useState(false);
	const [artIntMode, setArtIntMode] = useState(false);
	const [status, setStatus] = useState({
		type: "info",
		message: "Let's Start The Game!",
	});

	useEffect(() => {
		if (!winner) setHistory((prev) => [...prev, buttons]);
	}, [buttons, winner]);

	useEffect(() => {
		if (!winner)
			setStatus(() => ({
				type: "info",
				message: `Next Player: ${buttons.nextVal}`,
			}));
	}, [buttons, winner]);

	useEffect(() => {
		const winned = checkWinner(buttons);
		if (winned) {
			// We have a winner - done!
			setWinner(true);
			setStatus({
				type: "alert",
				message: `Winner is: ${winned}`,
			});
		} else if (buttons.squares.every((x) => x)) {
			// None of the buttons are empty, so we have a tie - done again!
			setWinner(true);
			setStatus({
				type: "alert",
				message: `That's a Tie!`,
			});
		}
	}, [buttons]);

	useEffect(() => {
		if (!winner && artIntMode && buttons.nextVal === "O") {
			const nextOne = chooseNextOne(buttons);
			const myTimeout = setTimeout(() => {
				handleSqClick(nextOne);
			}, Math.floor(Math.random() * 1000));
			return () => clearTimeout(myTimeout);
		}
	}, [buttons, winner, artIntMode]);

	useEffect(() => {
		setStatus(() => ({
			type: "info",
			message: "Let's Start The Game!",
		}));
	}, []);

	const handleSqClick = (sqOrder) => {
		if (!winner) {
			if (!buttons.squares[sqOrder]) {
				setButtons((prev) => {
					const prevSquares = [...prev.squares];
					prevSquares[sqOrder] = prev.nextVal;
					return {
						squares: prevSquares,
						nextVal: prev.nextVal === "X" ? "O" : "X",
					};
				});
			} else {
				setStatus(() => ({
					type: "error",
					message: "This square is already taken!",
				}));
			}
		}
	};

	const goToMove = (moveIndex) => {
		setButtons({
			squares: history[moveIndex].squares,
			nextVal: history[moveIndex].nextVal,
		});
		setStatus(() => ({
			type: "info",
			message: `Next Player: ${history[moveIndex].nextVal}`,
		}));
		setWinner(() => false);
		setHistory(() => {
			return history.slice(0, moveIndex);
		});
	};

	const toggleSwitcher = () => {
		setArtIntMode((prev) => !prev);
	};

	return (
		<>
			<h2>Tic Tac Toe Game Board</h2>
			<Squares buttons={buttons.squares} onClick={handleSqClick} />
			<History data={history} onClick={goToMove} />
			<StatusBar type={status.type} message={status.message} />
			<GameMode artIntMode={artIntMode} onClick={toggleSwitcher} />
		</>
	);
};

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

	// const wingSides = [
	// 	[0, 4],
	// 	[2, 4],
	// 	[6, 4],
	// 	[8, 4],
	// ];

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

	for (let i = 0; i < winConditions.length; i++) {
		if (winConditions[i].every((x) => sqArray.squares[x] === "X")) {
			return "X";
		} else if (winConditions[i].every((x) => sqArray.squares[x] === "O")) {
			return "O";
		}
	}

	return false;
};
