const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../dashboard.html'), 'utf8');
const helpers = source.slice(source.indexOf('        function normalizeStatus('), source.indexOf('        function jobSourceLabel('));
const { statusCountEntries, statusLabel } = new Function('dt', helpers + '; return {statusCountEntries, statusLabel};')(key => key === 'admin_status.canceled' ? 'Canceled' : key);

test('cancellation spellings combine without changing other counts or source data', () => {
    const values = { completed: 884, failed: 12, cancelled: 3, canceled: 11 };
    const entries = statusCountEntries(values);
    assert.deepEqual(entries, [['completed', 884], ['failed', 12], ['canceled', 14]]);
    assert.equal(entries.reduce((sum, [, count]) => sum + count, 0), 910);
    assert.equal(values.cancelled, 3);
    assert.equal(values.canceled, 11);
});

test('either spelling alone and casing variants use one translated label', () => {
    for (const key of ['canceled', 'cancelled', ' CANCELLED ']) {
        assert.deepEqual(statusCountEntries({ [key]: 3 }), [['canceled', 3]]);
        assert.equal(statusLabel(key), 'Canceled');
    }
    assert.deepEqual(statusCountEntries(), []);
    assert.deepEqual(statusCountEntries({ custom_status: 2 }), [['custom_status', 2]]);
});
