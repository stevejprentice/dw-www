var HelloMessage = React.createClass({
	render: function() {
		return <div>Hello {this.props.name}!</div>;
	}
});
ReactDOM.render(<HelloMessage name="David" />, document.getElementById("site"));
