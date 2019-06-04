import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { requestUploadImage, requestGetImage } from '../api/cat.js';
import Webcam from 'react-webcam';
import shutter from '../assets/sounds/shutter.ogg';
import dummyImage from '../assets/images/dummy';
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
		progress: 0,
		isWebcamReady: false,
		status: '',
		imageUrl: ''
	};

	setRef = webcam => {
		this.webcam = webcam;
	};

	contentType = 'image/jpeg';
	fileName = '';

	async componentDidUpdate() {
		if (this.state.status === 'upload') {
			this.uploadImage();
		}

		if (this.state.status === 'uploaded') {
			this.getImage();
		}
	}

	async uploadImage() {
		this.setState({ status: 'uploading' });

		await requestUploadImage(this.state.file, {
			onUploadProgress: pe =>
				this.setState({ progress: Math.round((pe.loaded * 100) / pe.total) }),
			onError: err => {
				console.log('error: ' + err);

				this.setState({ status: 'error' });
			}
		});

		this.setState({ status: 'uploaded' });
	}

	async getImage() {
		const response = await requestGetImage(this.state.fileName);

		this.setState({
			status: 'loaded',
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

	uploadPhoto(base64image) {
		const file = this.base64toFile(base64image);

		this.fileName = `photo_${new Date().toLocaleString().replace(/[ /:,]/g, '_')}.jpg`;
		this.setState({ file, status: 'upload' });
	}

	onButtonCaptureClick = e => {
		e.preventDefault();
		sound.shutter.play();

		const base64image = this.webcam.getScreenshot();
		this.uploadPhoto(base64image);
	};

	onButtonCatUploadClick = e => {
		e.preventDefault();

		this.uploadPhoto(dummyImage);
	};

	onWebcamReady = () => {
		this.setState({ isWebcamReady: true });
	};

	getContent() {
		if (this.state.status === 'uploading') {
			return <Loader progress={this.state.progress} />;
		}

		if (this.state.status === 'loaded') {
			return <Photo src={this.state.imageUrl} alt="This is you!" />;
		}

		if (this.state.status === 'error') {
			return (
				<div>
					<h1>You are not a cat!</h1>
					<h2>Do you want to upload a photo of cat?</h2>
					<Button onClick={this.onButtonCatUploadClick}>Yes!</Button>
				</div>
			);
		}

		if (!this.state.status) {
			const videoConstraints = {
				width: 1280,
				height: 720,
				facingMode: 'user'
			};

			const button = this.state.isWebcamReady && (
				<Button onClick={this.onButtonCaptureClick}>Capture Photo</Button>
			);

			return (
				<WebcamArea>
					{}
					<Webcam
						audio={false}
						ref={this.setRef}
						screenshotFormat={this.contentType}
						videoConstraints={videoConstraints}
						onUserMedia={this.onWebcamReady}
					/>
					{button}
				</WebcamArea>
			);
		}
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
