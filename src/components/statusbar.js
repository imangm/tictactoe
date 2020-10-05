import React from "react";

export const StatusBar = (props) => {
	return (
		<div className="status-bar-container">
			<div className={`status-bar ${props.type}`}>{props.message}</div>
		</div>
	);
};
