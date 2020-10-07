import React from "react";

export const GameMode = (props) => {
	return (
		<form className="game-mode">
			<div className="art-int-selector">
				<span className="toggle-text">One Player</span>
				<span
					onClick={props.onClick}
					className={`toggle-switch ${props.artIntMode ? " active" : ""}`}
				></span>
				<span className="toggle-text">Two Player</span>
			</div>
		</form>
	);
};
