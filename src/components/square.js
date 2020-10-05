import React from "react";

export const Square = (props) => {
	return (
		<button className="grid-item" onClick={() => props.onClick(props.sqOrder)}>
			{props.value}
		</button>
	);
};
