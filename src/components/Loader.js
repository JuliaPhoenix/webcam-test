import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoaderArea = styled.div``;
const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

const Spinner = styled.div`
	margin: 20px auto;
	position: relative;
	text-indent: -9999em;
	border: 5px solid rgba(0, 0, 0, 0.2);
	border-left: 5px solid #ffffff;
	transform: translateZ(0);
	animation: ${rotate360} 0.75s infinite linear;

	&,
	:after {
		border-radius: 50%;
		width: 50px;
		height: 50px;
	}
`;

const LoaderMessage = styled.div`
	font-size: 20px;
`;

const Loader = props => {
	return (
		<LoaderArea>
			<Spinner />
			<LoaderMessage>Uploading {props.progress}</LoaderMessage>
		</LoaderArea>
	);
};

export default Loader;
