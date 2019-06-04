import axios from 'axios';

const api = axios.create({
	baseURL: 'https://api.thecatapi.com/v1/',
	headers: {
		'x-api-key': '492fbd33-eee9-40db-b0a5-1e453ecd5689'
	}
});

const get = async (path, params) => {
	try {
		const response = await api.get(path, params);
		return response.data;
	} catch (err) {
		throw err;
	}
};

const post = async (path, params, config) => {
	try {
		const response = await api.post(path, params, config);
		return response.data;
	} catch (err) {
		throw err;
	}
};

export const requestGetImage = async fileName => {
	return await get('/images', { original_filename: fileName });
};

export const requestUploadImage = async (file, progress, error) => {
	let formData = new FormData();
	formData.append('file', file);

	return await post('/images/upload', formData, progress);
};
