import React from "react";
import { Square } from "./square";

export const Squares = (props) => {
	const theSquares = props.buttons.map((x, i) => (
		<Square
			key={i}
			sqOrder={i}
			value={props.buttons[i]}
			onClick={props.onClick}
		/>
	));

	return <div className="grid">{theSquares}</div>;
};
