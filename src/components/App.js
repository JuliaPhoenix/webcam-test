import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { requestUploadImage, requestGetImage } from '../api/cat.js';
import Webcam from 'react-webcam';
import shutter from '../assets/sounds/shutter.ogg';
import Loader from './Loader';
import Photo from './Photo';

const GlobalStyle = createGlobalStyle`
	html, body {
		height: 100%;
	}

	body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`;

const MainArea = styled.div`
	text-align: center;
`;

const WebcamArea = styled.div``;

const Button = styled.button`
	display: block;
	margin: 10px auto;
	font-size: 20px;
	padding: 10px;
	cursor: pointer;
`;

const sound = { shutter: new Audio(shutter) };

class App extends React.Component {
	state = {
		file: null,
		imageUrl: '',
		isUploadingProgress: false,
		isUploaded: false,
		isLoaded: false
	};

	setRef = webcam => {
		this.webcam = webcam;
	};

	contentType = 'image/jpeg';
	fileName = '';

	async componentDidUpdate() {
		if (this.state.isUploadingProgress) {
			this.uploadImage();
		}

		if (this.state.isUploaded) {
			this.getImage();
		}
	}

	async uploadImage() {
		await requestUploadImage(this.state.file);
		this.setState({ isUploaded: true });
	}

	async getImage() {
		const response = await requestGetImage(this.state.fileName);

		this.setState({
			isUploadingProgress: false,
			isUploaded: false,
			isLoaded: true,
			imageUrl: response[0].url
		});
	}

	base64toFile(base64) {
		const base64image = atob(base64.split(',')[1]);
		const bytes = new Array(base64image.length);

		for (let i = 0; i < base64image.length; i++) {
			bytes[i] = base64image.charCodeAt(i);
		}

		return new File([new Uint8Array(bytes)], this.fileName, { type: this.contentType });
	}

	onFormSubmit = e => {
		e.preventDefault();
		sound.shutter.play();

		this.fileName = `photo_${new Date().toLocaleString().replace(/[ /:,]/g, '_')}.jpg`;

		// const base64image = this.webcam.getScreenshot();

		const base64image =
			'data:image/jpeg;base64,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';

		const file = this.base64toFile(base64image);

		this.setState({ file, isUploadingProgress: true });
	};

	getContent() {
		if (this.state.isUploadingProgress) {
			return <Loader progress={this.state.uploadingProgress} />;
		}

		if (this.state.isLoaded) {
			return <Photo src={this.state.imageUrl} alt="This is you!" />;
		}

		const videoConstraints = {
			width: 1280,
			height: 720,
			facingMode: 'user'
		};

		return (
			<WebcamArea>
				<Webcam
					audio={false}
					ref={this.setRef}
					screenshotFormat={this.contentType}
					videoConstraints={videoConstraints}
				/>
				<Button onClick={this.onFormSubmit}>Capture Photo</Button>
			</WebcamArea>
		);
	}

	render() {
		const content = this.getContent();

		return (
			<MainArea>
				<GlobalStyle />
				{content}
			</MainArea>
		);
	}
}

export default App;
