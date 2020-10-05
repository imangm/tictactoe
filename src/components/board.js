import React, { useEffect, useState } from "react";
import { Squares } from "./squares";
import { StatusBar } from "./statusbar";
import { History } from "./history";

export const Board = (props) => {
	const [buttons, setButtons] = useState(new Array(9).fill(null));
	const [history, setHistory] = useState([]);

	const [winner, setWinner] = useState(false);
	useEffect(() => {
		const winned = checkWinner(buttons);
		if (winned) {
			setWinner(true);
			setStatus({
				type: "alert",
				message: `Winner is: ${winned}`,
			});
		} else if (buttons.every((x) => x)) {
			setWinner(true);
			setStatus({
				type: "alert",
				message: `That's a Tie!`,
			});
		}
	}, [buttons, winner]);

	const [nextVal, setNextVal] = useState("X");
	useEffect(() => {
		if (!winner)
			setHistory((prev) => [
				...prev,
				{
					nextVal: nextVal,
					buttons: buttons,
				},
			]);
	}, [buttons, winner, nextVal]);

	useEffect(() => {
		setStatus({
			type: "info",
			message: `Next Player: ${nextVal}`,
		});
	}, [nextVal]);

	const [status, setStatus] = useState({});
	useEffect(() => {
		setStatus({
			type: "info",
			message: "Let's Start The Game!",
		});
	}, []);

	const handleSqClick = (sqOrder) => {
		if (!winner) {
			if (!buttons[sqOrder]) {
				setButtons((prev) => {
					const toBeUpdate = [...prev];
					toBeUpdate[sqOrder] = nextVal;
					return toBeUpdate;
				});
				setNextVal(nextVal === "X" ? "O" : "X");
			} else {
				setStatus({
					type: "error",
					message: "This square is already taken!",
				});
			}
		}
	};

	const goToMove = (moveIndex) => {
		setButtons(history[moveIndex].buttons);
		setNextVal(history[moveIndex].nextVal);
		setStatus({
			type: "info",
			message: `Next Player: ${history[moveIndex].nextVal}`,
		});
		setWinner(false);
		setHistory(() => {
			return history.slice(0, moveIndex);
		});
	};

	return (
		<>
			<Squares buttons={buttons} onClick={handleSqClick} />
			<History data={history} onClick={goToMove} />
			<StatusBar type={status.type} message={status.message} />
		</>
	);
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
		if (winConditions[i].every((x) => sqArray[x] === "X")) {
			return "X";
		} else if (winConditions[i].every((x) => sqArray[x] === "O")) {
			return "O";
		}
	}

	return false;
};
