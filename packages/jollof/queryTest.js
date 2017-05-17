/**
 * Created by iyobo on 2017-04-25.
 */
const jollofQL = require('./lib/data').jollofql;
const parser = jollofQL.jqlParser;
const jql = jollofQL.jql;

console.log('testing SQ parser')
const util = require('util');

let val;
let val2;
const n = 90;

//const arr = [1, 2, 3]
//const inj = '105 OR id != null';
//val = parser.parse(jql`po = ${23} and home.*.city = ${inj} and xyz in ${arr} and (lastName != 'doe' or statusId in(1, 2, 3)) `);
//const startTime = Date.now();
//for (let i = 0; i < n - 1; i++) {
//    val2 = parser.parse(`home.*.city = ${inj} and xyz in ${arr} and (lastName != 'doe' or statusId in(1, 2, 3)) `);
//}
//
//const totalTime = Date.now() - startTime;
//console.log(`Performance: ${totalTime}ms  Mean: ${totalTime / n}ms`);
//console.log(val);
//console.log(val2);


const badInjection = "bar's OR id != null";
const badArray = [1, 2, 'f ) OR id != null '];
const arr = [1,2, 'f'];

const safeQuery = jql`foo = ${badInjection} AND age > 30 AND ( xyz in ${badArray} OR ijk in (j,k,9) ) AND arr not in ${arr}`;
const conditions = parser.parse(safeQuery)
console.log(conditions);
//const str = parser.compile(conditions);
//console.log(str);
