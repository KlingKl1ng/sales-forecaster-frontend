const assert = require('node:assert/strict');
const {test} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../forecaster.html'), 'utf8');
const helpers = source.slice(source.indexOf('const numberLocaleForLanguage ='), source.indexOf('const rowContestMetric ='));
const {numberLocaleForLanguage: locale, fmtNumber: format, formatEvaluationValue: metric, formatChartAxis: axis} = new Function(helpers + '\nreturn {numberLocaleForLanguage, fmtNumber, formatEvaluationValue, formatChartAxis};')();
test('selected app language determines grouping and decimal separators', () => {
    assert.equal(format(1999.999, 0, 3, locale('en')), '1,999.999');
    for (const lang of ['vi', 'de']) assert.equal(format(1999.999, 0, 3, locale(lang)), '1.999,999');
    assert.equal(locale('unknown'), 'en-US');
});
test('metrics and axes use the same locale while preserving display precision', () => {
    for (const lang of ['vi', 'de']) {
        assert.equal(metric(28.4, 'mape', locale(lang)), '28,4%');
        assert.equal(metric(1234.5, 'rmse', locale(lang)), '1.235');
        assert.equal(format(1234.5, 1, 1, locale(lang)), '1.234,5');
        assert.equal(axis(1234.5, locale(lang)), '1.234,5');
        assert.equal(axis(0.0015, locale(lang)), '1,5E-3');
    }
    assert.equal(metric(28.4, 'mape', locale('en')), '28.4%');
});
test('zero, negatives and unavailable values retain their meaning', () => {
    assert.equal(format(0, 1, 1, locale('vi')), '0,0');
    assert.equal(format(-1999.125, 0, 3, locale('de')), '-1.999,125');
    for (const value of [null, undefined, '-']) assert.equal(format(value, 0, 3, locale('vi')), '-');
    assert.equal(metric(NaN, 'rmse', locale('de')), '-');
});
test('formatting does not change numeric source values or API serialization', () => {
    const row = {forecast:1999.999, mape:28.4};
    const original = JSON.stringify(row);
    for (const lang of ['en', 'vi', 'de']) format(row.forecast, 0, 3, locale(lang));
    assert.equal(JSON.stringify(row), original);
});
