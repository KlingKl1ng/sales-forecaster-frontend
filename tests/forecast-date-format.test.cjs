const assert = require('node:assert/strict');
const {test} = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../forecaster.html'), 'utf8');
const helper = source.slice(source.indexOf('const formatForecastDate ='), source.indexOf('const formatChartAxis ='));
const format = new Function(helper + '; return formatForecastDate;')();
test('Vietnamese and German dates are localized; English keeps ISO calendar order', () => {
    assert.equal(format('2026-02-03', 'vi-VN'), '03/02/2026');
    assert.equal(format('2026-02-03', 'de-DE'), '03.02.2026');
    assert.equal(format('2026-02-03', 'en-US'), '2026-02-03');
    assert.equal(format('2024-02-29', 'vi-VN'), '29/02/2024');
});
test('hourly timestamps retain their time, precision and timezone without date shifts', () => {
    assert.equal(format('2026-01-01T00:00:00Z', 'vi-VN'), '01/01/2026 00:00:00Z');
    assert.equal(format('2025-12-31T23:30:00.125-05:00', 'de-DE'), '31.12.2025 23:30:00.125-05:00');
    assert.equal(format('2026-01-01 01:00', 'en-US'), '2026-01-01 01:00');
});
test('missing labels and non-ISO values are not guessed or reinterpreted', () => {
    assert.equal(format(null, 'vi-VN'), '');
    assert.equal(format('', 'de-DE'), '');
    assert.equal(format('01/02/2026', 'en-US'), '01/02/2026');
    assert.equal(format('2026', 'vi-VN'), '2026');
});
