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

beforeEach('Clear DB', async () => {
    const deletionThunks = [];

    _.each(jollof.models, (model, name) => {
        deletionThunks.push(async () => {
            return await model.remove({}, { multi: true })
        });
    });

    return Promise.all(deletionThunks)
});

describe('Jollof Data', function () {

    describe('Models', function () {

        it('save() and findOne()', async function () {


            const john = new Foo({ name: 'John Snow', age: 25 });
            await john.save();
            //console.log(john)

            const cain = new Foo({ name: 'Cain Adam', age: 999 });
            await cain.save();
            //console.log(cain);

            const person = await Foo.findOne({ age: 25 });

            person.age.should.equal(25);

        });

        it('findOne with id as param', function () {

            return co(function* () {

                const john = new Foo({ name: 'John Snow', age: 25 });
                yield* john.save();
                //console.log(john)

                const cain = new Foo({ name: 'Cain Adam', age: 999 });
                yield* cain.save();
                //console.log(cain);

                const person = yield* Foo.findOne({ id: cain.id });

                expect(person).to.exist;
                expect(person.age).to.equal(999);
                expect(person.id).to.equal(cain.id);

            });

        });

        it('validate() fails as should', function () {

            return co(function* () {

                try {
                    const person = new Foo({ name: 24, age: 26 });
                    yield person.save();

                    assert.fail(0, 0, 'This validation should have failed, but passed anyway.')
                } catch (err) {
                    if (err.isOperational)
                        expect(err.isOperational).to.be.true;
                    else
                        throw err;

                }
            });

        });

        it('findById()', function () {

            return co(function* () {

                const john = new Foo({ name: 'John Snow', age: 25 });
                yield* john.save();
                //console.log(john)

                const cain = new Foo({ name: 'Cain Adam', age: 999 });
                yield* cain.save();
                //console.log(cain);

                const person = yield* Foo.findById(cain.id);

                expect(person).to.exist
                expect(person.age).to.equal(999);
                expect(person.id).to.equal(cain.id);

            });

        });


        describe('find(criteria,opts)', function () {

            beforeEach('equal', () => {
                return co(function* () {
                    const p2 = new Foo({ name: 'Fety Wap', age: 25 });
                    yield* p2.save();

                    const p1 = new Foo({ name: 'Goty Finkle', age: 33 });
                    yield* p1.save();

                    const p3 = new Foo({ name: 'Flex Masta Loxd', age: 25 });
                    yield* p3.save();

                    const p4 = new Foo({ name: 'Lox', age: 3 });
                    yield* p4.save();

                });
            });

            it('with id as param', function () {

                return co(function* () {

                    const john = new Foo({ name: 'John Snow', age: 25 });
                    yield* john.save();
                    //console.log(john)

                    const cain = new Foo({ name: 'Cain Adam', age: 999 });
                    yield* cain.save();
                    //console.log(cain);

                    const person = yield* Foo.find({ id: cain.id });

                    expect(person).to.not.be.empty;
                    expect(person[0].age).to.equal(999);
                    expect(person[0].id).to.equal(cain.id);

                });

            });

            it('equal', () => {

                return co(function* () {

                    // equal
                    let res = yield* Foo.find({ age: 25 });
                    expect(res.length).to.equal(2);
                });
            });
            it('not equal', () => {

                return co(function* () {
                    //not equal
                    res = yield* Foo.find({ age: { $ne: 3 } });
                    expect(res.length).to.equal(3);
                });
            });
            it('lt', () => {

                return co(function* () {
                    //less than
                    res = yield* Foo.find({ age: { $lt: 5 } });
                    expect(res.length).to.equal(1);
                    expect(res[0].name).to.equal('Lox');
                });
            });
            it('lte', () => {

                return co(function* () {
                    //less than or equal
                    res = yield* Foo.find({ age: { $lte: 25 } });
                    expect(res.length).to.equal(3);
                });
            });
            it('gt', () => {

                return co(function* () {
                    //greater than
                    res = yield* Foo.find({ age: { $gt: 25 } });
                    expect(res.length).to.equal(1);
                    expect(res[0].name).to.equal('Goty Finkle');
                });
            });
            it('gte', () => {

                return co(function* () {
                    //greater than or equal
                    res = yield* Foo.find({ age: { $gte: 25 } });
                    expect(res.length).to.equal(3);
                });
            });
            it('in', () => {

                return co(function* () {
                    //in
                    res = yield* Foo.find({ age: { $in: [25, 45] } });
                    expect(res.length).to.equal(2);
                });
            });
            it('not in', () => {

                return co(function* () {
                    //not in
                    res = yield* Foo.find({ age: { $nin: [25, 45, 3] } });
                    expect(res.length).to.equal(1);
                    expect(res[0].name).to.equal('Goty Finkle');

                });
            });
            it('regex', () => {

                return co(function* () {
                    //regex
                    res = yield* Foo.find({ name: { $regex: /Masta/ } });
                    expect(res.length).to.equal(1);

                });

            });

            it('paging', () => {

                return co(function* () {
                    res = yield* Foo.find({}, {
                        paging: {
                            page: 2,
                            limit: 3
                        }
                    });
                    expect(res.length).to.equal(1);

                });

            });

            it('sorting ASC', () => {

                return co(function* () {
                    res = yield* Foo.find({}, {
                        sort: {
                            age: 1,
                        }
                    });
                    expect(res[0].age).to.equal(3);

                });

            });
            it('sorting DESC', () => {

                return co(function* () {
                    res = yield* Foo.find({}, {
                        sort: {
                            age: -1,
                        }
                    });
                    expect(res[0].age).to.equal(33);

                });

            });

        });

        it('remove(criteria,opts)', function () {

            return co(function* () {

                const p1 = new Foo({ name: 'Goty Finkle', age: 33 });
                yield* p1.save();

                const p2 = new Foo({ name: 'Fety Wap', age: 25 });
                yield* p2.save();

                const p3 = new Foo({ name: 'Fung Shu', age: 15 });
                yield* p3.save();

                yield* Foo.remove({ age: 25 });

                let res = yield* Foo.find({});
                expect(res.length).to.equal(2);

                res = yield* Foo.find({ age: 25 });
                expect(res.length).to.equal(0);

            });

        });

        it('update(criteria,opts)', function () {

            return co(function* () {

                const p1 = new Foo({ name: 'Goty Finkle', age: 33 });
                yield* p1.save();

                const p2 = new Foo({ name: 'Fety Wap', age: 25 });
                yield* p2.save();

                const p3 = new Foo({ name: 'Fung Shu', age: 15 });
                yield* p3.save();

                yield* Foo.update({ age: 25 }, { age: 50 });

                let res = yield* Foo.find({ age: 50 });
                expect(res.length).to.equal(1);

                res = yield* Foo.find({ age: 25 });
                expect(res.length).to.equal(0);

            });

        });


    });
});
