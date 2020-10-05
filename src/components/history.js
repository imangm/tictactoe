import React from "react";

export const History = (props) => {
	const historyButtons = props.data.map((x, i) => {
		return i === 0 ? (
			<button key={i} onClick={() => props.onClick(i)} className="btn">
				Go to game start
			</button>
		) : (
			<button key={i} onClick={() => props.onClick(i)} className="btn">
				Go to move #{i}
			</button>
		);
	});

	return (
		<div className="history">
			<h4>Game History:</h4>
			{historyButtons}
		</div>
	);
};
