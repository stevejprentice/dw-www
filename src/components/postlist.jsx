var PostList = React.createClass({

	render: function() {
		return (
			<section className={this.props.elId}>
					<header>
						<h2 className="large">// {this.props.title}</h2>
					</header>
					<article>
						<ul id={ this.props.elId + "List" } className={ "unstyled-list " + this.props.elId } >
							<li>Loading...</li>
						</ul>
					</article>
			</section>
		);
	}
})
