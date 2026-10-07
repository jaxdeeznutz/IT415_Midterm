const test=require('node:test');
const assert=require('node:assert/strict');
const {total,change,validate,amount}=require('../core.js');
test('Exam cart, quantity changes and removal',()=>{let c={coffee:2,sandwich:1,soda:1};assert.equal(total(c),17500);c=change(c,'coffee',1);assert.equal(total(c),22000);c=change(c,'coffee',-1);assert.equal(total(c),17500);c=change(c,'soda',-1);assert.equal(total(c),14000);assert.deepEqual(change({},'coffee',-1),{});});
test('Invalid and insufficient payments are rejected',()=>{for(const s of ['', ' ', '-1','abc','NaN','Infinity','1e3','175.001','1,000','99999999'])assert.ok(validate(s,17500).error,s);assert.ok(validate('100',17500).error.includes('₱75.00'));});
test('Exact, excess and fractional cash use integer cents',()=>{assert.deepEqual(validate('200',17500),{paid:20000,change:2500});assert.deepEqual(validate('175',17500),{paid:17500,change:0});assert.deepEqual(validate('200',14000),{paid:20000,change:6000});assert.equal(amount('175.25'),17525);assert.deepEqual(validate('175.25',17500),{paid:17525,change:25});});
