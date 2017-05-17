/**
 * Created by iyobo on 2017-01-01.
 */
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
const _ = require('lodash');

const co = require('co');
const jollof = require('../');
const Foo = jollof.models.Foo;
var request = require('supertest');

const apiRoot = '/api/v1/resource';
const fooApiRoot = apiRoot+'/Foo';

beforeEach('Clear DB', () => {
	const deletionThunks = [];

	_.each(jollof.models, (model) => {
		deletionThunks.push(function*() {
			return yield model.remove({})
		});
	});

	return co(function*() {

		yield* deletionThunks;
	});
});

describe('Jollof REST', function () {

	describe('Resource API', function () {

		it('lists all Resources', function () {

			return co(function*() {
				try {
					expect(jollof.serverApp).to.exist;


					const response = yield request(jollof.serverApp.listen()).get(apiRoot).expect(200).expect('Content-Type', /json/)

					expect(response.body).to.exist;
					assert(Array.isArray(response.body), true, 'Response is not an array of Models');
					assert.isAtLeast(response.body.length, 1);

					return response;
				} catch (err) {
					throw err;
				}

			});

		});

		//it('find with filter', function () {
		//
		//	return co(function*() {
		//		try {
		//
		//			expect(jollof.serverApp).to.exist;
		//
		//			//yield request(jollof.serverApp.listen()).post(fooApiRoot)
		//			//	.field('name', 'John Snow')
		//			//	.field('age', 25)
		//			//	.expect(200).expect('Content-Type', /json/);
		//			//
		//			//yield request(jollof.serverApp.listen()).post(fooApiRoot)
		//			//	.field('name', 'Cain Adam')
		//			//	.field('age', 999)
		//			//	.expect(200).expect('Content-Type', /json/);
		//
		//			const john = new Foo({ name: 'John Snow', age: 25 });
		//			yield* john.save();
		//			//console.log(john)
		//
		//			const cain = new Foo({ name: 'Cain Adam', age: 999 });
		//			yield* cain.save();
		//
		//			const response = yield request(jollof.serverApp.listen()).get(fooApiRoot)
		//				//.field('filters[0][0]', 'age')
		//				//.field('filters[0][1]', '==')
		//				//.field('filters[0][2]', 25)
		//				.expect(200).expect('Content-Type', /json/);
		//
		//			expect(response.body).to.exist;
		//			assert(Array.isArray(response.body), true, 'Response is not an array of Models');
		//			assert(response.body.length,2,'List should be of length 2');
		//
		//			return response;
		//		} catch (err) {
		//			throw err;
		//		}
		//
		//	});
		//
		//});


	});
});
