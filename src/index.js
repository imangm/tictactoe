import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Welcome to Tic Tac Toe",
			timer: 2000,
		};
	}
	render() {
		return (
			<div>
				<Loader timer={this.state.timer} />
				<h1>{this.state.title}</h1>
				<Button />
			</div>
		);
	}
}

class Loader extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loading: true };
		this.hideLoading = this.hideLoading.bind(this);
	}

	componentDidMount() {
		this.hideLoading(this.props.timer);
	}

	hideLoading(timer) {
		setTimeout(() => this.setState({ loading: false }), timer);
	}

	render() {
		return (
			<div className={this.state.loading ? "loading loader" : "loaded loader"}>
				<span>Loading...</span>
			</div>
		);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "Click Me",
			theClass: "none",
		};
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnClick() {
		this.setState({
			theClass: this.state.theClass === "none" ? "btn" : "none",
		});
	}

	componentDidUpdate() {}

	render() {
		return (
			<button className={this.state.theClass} onClick={this.handleOnClick}>
				{this.state.title}
			</button>
		);
	}
}

ReactDOM.render(<Header />, document.getElementById("root"));
