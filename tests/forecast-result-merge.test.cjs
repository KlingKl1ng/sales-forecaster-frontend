const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../forecaster.html'), 'utf8');
const merge = new Function(source.slice(source.indexOf('const equalForecastResult ='), source.indexOf('const getAdaptivePollDelay =')) + '; return mergeForecastResults;')();
const result = sku => ({sku,best_ts_model:'ses',validation_summary:{evaluations:2},validation_forecasts:[{origin:'2024-01-01',date:'2024-02-01',lead:1,actual:0,forecast:12}],mape_validation:null});
const copy = value => JSON.parse(JSON.stringify(value));

test('repeated poll responses retain the array and completed ID references',()=>{
    const previous=[result('A')];
    assert.equal(merge(previous,copy(previous)),previous);
    assert.equal(merge(previous,[]),previous);
    assert.equal(merge(null,[]),null);
});
test('another ID finishing does not replace the ID being replayed',()=>{
    const previous=[result('A')], next=merge(previous,[copy(previous[0]),result('B')]);
    assert.notEqual(next,previous);assert.equal(next[0],previous[0]);
    assert.deepEqual(next.map(r=>r.sku),['A','B']);assert.equal(previous.length,1);
    assert.equal(merge(next,[copy(next[1])]),next);
});
test('JSON key ordering does not reset otherwise identical results',()=>{
    const previous=[result('A')];
    const reordered=JSON.parse(JSON.stringify(previous[0]),(key,value)=>value && !Array.isArray(value) && typeof value==='object' ? Object.fromEntries(Object.entries(value).reverse()):value);
    assert.equal(merge(previous,[reordered]),previous);
});
test('changed fold predictions replace only the changed result',()=>{
    const previous=[result('A'),result('B')],incoming=copy(previous);
    incoming[0].validation_forecasts[0].forecast=13;
    const next=merge(previous,incoming);
    assert.equal(next[0],incoming[0]);assert.equal(next[1],previous[1]);
    assert.equal(previous[0].validation_forecasts[0].forecast,12);
});
test('removed fields, changed array lengths and null versus zero remain meaningful changes',()=>{
    for(const change of [r=>delete r.validation_summary,r=>r.validation_forecasts.push({...r.validation_forecasts[0],lead:2}),r=>r.mape_validation=0]){
        const previous=[result('A')],incoming=copy(previous);change(incoming[0]);
        assert.equal(merge(previous,incoming)[0],incoming[0]);
    }
});
