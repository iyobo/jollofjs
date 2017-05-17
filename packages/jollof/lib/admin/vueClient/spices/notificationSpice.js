/**
 * Created by iyobo on 2017-01-17.
 */

const nprogress = require('nprogress');

class NotificationSpice {

	constructor() {
		this.show = true;
	}

	start() {
		nprogress.start();
	}

	stop() {
		nprogress.done();
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

export default new NotificationSpice();