import React from 'react';

class Photo extends React.Component {
	state = {
		status: ''
	};

	componentDidMount() {
		this.setState({ status: 'loading' });
	}

	onImageLoad = () => {
		this.setState({ status: 'done' });
	};

	onImageError = () => {
		this.setState({ status: 'error' });
	};

	getMessage() {
		if (this.state.status === 'loading') {
			return <div>Getting your photo, just a second!</div>;
		}

		if (this.state.status === 'error') {
			return <div>Some error occured, sorry :(</div>;
		}

		if (this.state.status === 'done') {
			return <div>Now this is you! (well, almost):</div>;
		}
	}

	render() {
		const message = this.getMessage();
		const imgStyle = this.state.status === 'done' ? {} : { visibility: 'hidden' };

		return (
			<div>
				<div>{message}</div>
				<div>
					<img
						style={imgStyle}
						src={this.props.src}
						alt={this.props.alt}
						onLoad={this.onImageLoad}
						onError={this.onImageError}
					/>
				</div>
			</div>
		);
	}
}

export default Photo;
