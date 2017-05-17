/**
 * Created by iyobo on 2017-01-17.
 */

const nprogress = require('nprogress');

class Popup {

	constructor() {

	}

	error(msg) {
		$.notify(msg, {
			type: 'danger'
		});
	}

	info(msg) {
		$.notify(msg, "info");
	}

}

export default new Popup();