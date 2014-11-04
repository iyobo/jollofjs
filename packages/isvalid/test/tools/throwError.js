var expect = require('chai').expect,
    domain = require('domain');

// A convenience method for tests throwing errors.
// The asynchronous nature of the library does not
// ensure errors thrown within the scope of mocha.
// Therefore we wrap them in domains.

module.exports = function(todo, done) {
	
	var errorThrown = false;
	var timeoutId;
	
	var d = domain.create();
	
	d.on('error', function(err) {
		if (timeoutId !== undefined) clearTimeout(timeoutId);
		expect(err instanceof Error).to.be.true;
		d.exit();
		if (done) done();
	});
	
	d.run(function() {
		if (todo) todo();
		timeoutId = setTimeout(function() {
			d.exit();
			expect(errorThrown).to.be.true;
			if (done) done();
		}, 1000);
	});
	
};
