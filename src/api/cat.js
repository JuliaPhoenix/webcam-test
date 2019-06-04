import axios from 'axios';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';
axios.defaults.headers.common['x-api-key'] = '492fbd33-eee9-40db-b0a5-1e453ecd5689';

const get = async (path, params) => {
	try {
		const response = await axios.get(path, params);

		return response.data;
	} catch (err) {
		throw err;
	}
};

const post = async (path, formData, callbacks) => {
	try {
		const response = await axios.post(path, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress: callbacks.onUploadProgress
		});

		return response.data;
	} catch (err) {
		callbacks.onError && callbacks.onError(err.response.status);

		throw err;
	}
};

export const requestGetImage = async fileName => {
	return await get('/images', { original_filename: fileName });
};

export const requestUploadImage = async (file, callbacks) => {
	let formData = new FormData();
	formData.append('file', file);

	return await post('/images/upload', formData, callbacks);
};
