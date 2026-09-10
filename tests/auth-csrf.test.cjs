const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../operartis-api.js'), 'utf8');

function client(fetch) {
    const storage = new Map([['operartis_csrf_token', 'stale']]);
    const events = [];
    const window = {
        fetch, location: new URL('http://127.0.0.1/dashboard#profile'),
        addEventListener() {}, dispatchEvent(event) { events.push(event.type); },
    };
    const sessionStorage = {
        getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value),
        removeItem: key => storage.delete(key),
    };
    vm.runInNewContext(source, {
        window, document: { addEventListener() {} }, sessionStorage, localStorage: sessionStorage,
        Headers, URL, setTimeout, clearTimeout,
        CustomEvent: class { constructor(type) { this.type = type; } },
    });
    return { api: window.OperartisApi, events };
}
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });

test('stale-token recovery retries the exact draft once without reloading auth state', async () => {
    let refreshes = 0;
    const attempts = [];
    const { api, events } = client(async (url, options) => {
        if (url.endsWith('/auth/me')) {
            refreshes++;
            return json({ csrf_token: 'fresh', user: { id: 'member' } });
        }
        attempts.push({ body: options.body, token: options.headers.get('X-CSRF-Token') });
        return options.headers.get('X-CSRF-Token') === 'fresh'
            ? json({ languages: ['vi'] }) : json({ detail: 'Invalid CSRF token.' }, 403);
    });
    const draft = JSON.stringify({ languages: ['vi'] });
    const response = await api.apiFetch('/auth/profile', { method: 'PATCH', body: draft });
    assert.equal(response.status, 200);
    assert.equal(refreshes, 1);
    assert.deepEqual(attempts, [{ body: draft, token: 'stale' }, { body: draft, token: 'fresh' }]);
    assert(!events.includes('operartis:auth-state'));
});

test('concurrent saves share token recovery and each retry at most once', async () => {
    let refreshes = 0, writes = 0;
    const { api } = client(async (url, options) => {
        if (url.endsWith('/auth/me')) {
            refreshes++;
            await new Promise(resolve => setTimeout(resolve, 20));
            return json({ csrf_token: 'fresh' });
        }
        writes++;
        return json({ detail: 'Invalid CSRF token.' }, 403);
    });
    const responses = await Promise.all([1, 2].map(() => api.apiFetch('/auth/profile', { method: 'PATCH' })));
    assert(responses.every(response => response.status === 403));
    assert.equal(refreshes, 1);
    assert.equal(writes, 4);
});

test('permission failures are not retried as CSRF failures', async () => {
    const calls = [];
    const { api } = client(async url => {
        calls.push(url);
        return json({ detail: 'Forbidden.' }, 403);
    });
    assert.equal((await api.apiFetch('/auth/profile', { method: 'PATCH' })).status, 403);
    assert.equal(calls.length, 1);
});
