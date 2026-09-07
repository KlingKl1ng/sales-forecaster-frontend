const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../forecaster.html'), 'utf8');
// Exercise the actual page helpers and KPI reducer, including their wiring.
const helpers = source.slice(source.indexOf('const EVALUATION_METRIC_FIELDS ='), source.indexOf('const SELECTABLE_MODEL_ORDER ='));
const start = source.indexOf('const total = results.length;', source.indexOf('const KPICards ='));
const end = source.indexOf('};', source.indexOf('return {', start)) + 2;
const kpis = new Function('results', 'skuCount', helpers + source.slice(start, end));
test('unavailable metrics are excluded independently, while zero is counted', () => {
    const result = kpis([{mape_validation: 20, mae_validation: 10, rmse_validation: 12},
        {mape_validation: null, mae_validation: 0, rmse_validation: 0}], 2);
    assert.equal(result.avgMape, 20);
    assert.equal(result.avgMae, 5);
    assert.equal(result.avgRmse, 6);
});
test('entirely unavailable metrics remain unavailable', () => {
    const result = kpis([{mape_validation: null, mae_validation: null, rmse_validation: null}], 1);
    assert.equal(result.avgMape, null);
    assert.equal(result.avgMae, null);
    assert.equal(result.avgRmse, null);
});
test('nonfinite metrics and negative legacy MSE cannot contaminate averages', () => {
    const result = kpis([{mae_validation: Infinity, mape_validation: 'NaN', mse_validation: -2},
        {mae_validation: 4, mape_validation: 10, mse_validation: 9}], 2);
    assert.equal(result.avgMae, 4);
    assert.equal(result.avgMape, 10);
    assert.equal(result.avgRmse, 3);
});
