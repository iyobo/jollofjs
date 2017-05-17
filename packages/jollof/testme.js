/**
 * Created by iyobo on 2017-01-10.
 */
const jollof = require('./index');
const co = require('co');
var jql = require('./lib/data/index.js').jql;

co(function*() {
    yield jollof.bootstrap.boot()

    const Foo = jollof.models.Foo;

    const james = new Foo({ name: 'James Collin', age: 31 });
    const tom = new Foo({ name: 'Tom Finkle', age: 35 });

    yield james.save();
    yield tom.save();

    const person = yield Foo.findOne(jql`age=${35}`);

    yield Foo.native.pityFoo('Alexander');

    yield Foo.findNear(2, 5, 4, 6)

    console.log('RESULT', person.display());
}).catch((err) => {
    console.error(err);
});
