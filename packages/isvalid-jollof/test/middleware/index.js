'use strict';

var request = require('supertest'),
	expect = require('chai').expect;

describe('middleware', function() {

	var app;
	before(function() {
		app = require('./tools/server.js');
	});

	describe('param validator', function() {

		it ('should come back with 400 if param does not match schema.', function(done) {
			request(app)
			.get('/param/test')
			.expect(400, function(err, res) {
				expect(res.body).to.have.property('error').equal('validation-error');
				done(err);
			});
		});

		it ('should come back with 200 if param matches schema.', function(done) {
			request(app)
			.get('/param/123')
			.expect(200, done);
		});

	it ('should call route and come back with 201 if param matches schema.', function(done) {
		request(app)
		.get('/cbParam/test')
		.expect(201, done);
	});

	});

	describe('query validator', function() {

		it ('should come back with 400 if query matches schema.', function(done) {
			request(app)
			.get('/query?test=nonmatching')
			.expect(400, function(err, res) {
				expect(res.body).to.have.property('error').equal('validation-error');
				expect(res.body).to.have.property('keyPath').equal('query.test');
				done(err);
			});
		});

		it ('should come back with 200 and correct body if query matches schema.', function(done) {
			request(app)
			.get('/query?test=myTest')
			.expect(200, function(err, res) {
				expect(res.body).to.have.property('test').equal('myTest');
				done(err);
			});
		});

	});

	describe('body validator', function() {

		it ('should come back with 400 if post body does not match schema.', function(done) {
			request(app)
			.post('/post')
			.send({ test: 'nonmatching' })
			.expect(400, function(err, res) {
				expect(res.body).to.have.property('error').equal('validation-error');
				expect(res.body).to.have.property('keyPath').equal('body.test');
				done(err);
			});
		});

		it ('should come back with 200 and correct body set if post body matches schema.', function(done) {
			request(app)
			.post('/post')
			.send({ test: ['myTest'] })
			.expect(200, function(err, res) {
				expect(res.body).to.have.property('test').to.be.an('Array').of.length(1);
				expect(res.body.test[0]).to.be.a('String').equal('myTest');
				done(err);
			});
		});

		it ('should come back with 200 and correct body set if post body matches schema (x100).', function(done) {
			var completed = 0;
			var callback = function(err, res) {
				expect(res.body).to.have.property('test').to.be.an('Array').of.length(1);
				expect(res.body.test[0]).to.be.a('String').equal('myTest');
				if (++completed == 100) done(err);
			};
			for (var idx = 0 ; idx < 100 ; idx++) {
				request(app)
				.post('/post')
				.send({ test: ['myTest'] })
				.expect(200, callback);
			}
		});

	});

});
