/**
 * Created by iyobo on 2017-01-17.
 */
const axios = require('axios');
import notificationSpice from './notificationSpice';


function _reportError(error) {
	notificationSpice.stop();
	console.error(error);
	const data = error.response.data;

	if (data && data.keyPath) {

		const message = data.keyPath.join('.').toUpperCase() + ' ' + data.message;

		notificationSpice.error(message);
		return data;
	} else {
		notificationSpice.error(error.message);

	}
}

class AjaxSpice {
	constructor() {

	}

	get(path, params) {

		notificationSpice.start();
		return axios.get(path, params)
			.catch((error) => {

				_reportError(error);
			}).then((response) => {

				notificationSpice.stop();
				return response;
			});

	}

	create(path, params) {

		notificationSpice.start();
		return axios.post(path, params)
			.catch((error) => {

				_reportError(error);
			}).then((response) => {

				notificationSpice.stop();
				return response;
			});
	}

	update(path, params) {

		notificationSpice.start();
		return axios.patch(path, params)
			.catch((error) => {

				_reportError(error);
			}).then((response) => {

				notificationSpice.stop();
				return response;
			});
	}

	delete(path, params) {

		notificationSpice.start();
		return axios.delete(path, params)
			.catch((error) => {

				_reportError(error);
			}).then((response) => {

				notificationSpice.stop();
				return response;
			});

	}
}

/**
 * Exports a singleton
 */
export default new AjaxSpice();
