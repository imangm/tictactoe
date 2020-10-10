import React, { useEffect, useState } from "react";
import { Squares } from "./squares";
import { StatusBar } from "./statusbar";
import { GameMode } from "./gamemode";
import { History } from "./history";
import { chooseNextOne, checkWinner } from "../logics";

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
		const hasWon = checkWinner(buttons.squares);
		if (hasWon) {
			// We have a winner - done!
			setWinner(true);
			setStatus({
				type: "alert",
				message: `Winner is: ${hasWon}`,
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
			// toggle the above with the bottom code to switch between
			// a mode that uses minimax from the first move and a mode
			// which uses the minimax after third move
			// (60000+ processes vs 1000- processes)

			// const nextOne = nextBestMove(buttons);
			handleSqClick(nextOne);
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
