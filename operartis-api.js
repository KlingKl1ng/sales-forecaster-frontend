(function () {
    var originalFetch = window.fetch.bind(window);
    var csrfToken = sessionStorage.getItem('operartis_csrf_token') || '';
    var AUTH_BROADCAST_KEY = 'operartis_auth_broadcast';
    var csrfRefreshPromise = null;

    function broadcastAuthEvent(type) {
        try {
            localStorage.setItem(AUTH_BROADCAST_KEY, JSON.stringify({
                type: type,
                at: Date.now()
            }));
        } catch (error) { }
    }

    function handleAuthBroadcast(event) {
        if (event.key !== AUTH_BROADCAST_KEY || !event.newValue) return;
        try {
            var payload = JSON.parse(event.newValue);
            if (payload.type === 'logout') {
                setCsrf('');
                window.dispatchEvent(new CustomEvent('operartis:logged-out'));
            } else if (payload.type === 'login') {
                window.dispatchEvent(new CustomEvent('operartis:login-broadcast'));
            }
        } catch (error) { }
    }

    window.addEventListener('storage', handleAuthBroadcast);

    function isLocalHost(hostname) {
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    }

    function getDefaultApiBase() {
        var override = sessionStorage.getItem('operartis_api_base');
        if (override) return override.replace(/\/$/, '');
        if (isLocalHost(window.location.hostname) || window.location.protocol === 'file:') return 'http://127.0.0.1:8000';
        if (window.location.hostname.indexOf('staging.') === 0) return 'https://api-staging.operartis.io';
        return 'https://api.operartis.io';
    }

    function isApiRequest(input) {
        var raw = typeof input === 'string' ? input : input && input.url;
        if (!raw) return false;
        try {
            var url = new URL(raw, window.location.href);
            return url.hostname === 'api.operartis.io' ||
                url.hostname === 'api-staging.operartis.io' ||
                url.hostname === 'localhost' ||
                url.hostname === '127.0.0.1';
        } catch (e) {
            return false;
        }
    }

    function shouldDispatchUnauthorized(input) {
        var raw = typeof input === 'string' ? input : input && input.url;
        if (!raw) return true;
        try {
            var url = new URL(raw, window.location.href);
            return url.pathname !== '/auth/login';
        } catch (e) {
            return true;
        }
    }

    function methodOf(init) {
        return String((init && init.method) || 'GET').toUpperCase();
    }

    function isUnsafeMethod(init) {
        var method = methodOf(init);
        return method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
    }

    function pathOf(input) {
        var raw = typeof input === 'string' ? input : input && input.url;
        if (!raw) return '';
        try {
            return new URL(raw, window.location.href).pathname;
        } catch (e) {
            return '';
        }
    }

    function isCsrfBootstrapExempt(input) {
        var path = pathOf(input);
        return path === '/auth/login' ||
            path === '/auth/invites/accept' ||
            path.indexOf('/auth/password/reset') === 0;
    }

    function setCsrf(token) {
        csrfToken = token || '';
        if (csrfToken) sessionStorage.setItem('operartis_csrf_token', csrfToken);
        else sessionStorage.removeItem('operartis_csrf_token');
    }

    function withAuthOptions(init) {
        var options = Object.assign({}, init || {});
        options.credentials = 'include';

        var headers = new Headers(options.headers || {});
        var method = methodOf(options);
        if (csrfToken && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
            headers.set('X-CSRF-Token', csrfToken);
        }
        options.headers = headers;
        return options;
    }

    async function refreshCsrfToken() {
        if (csrfRefreshPromise) return csrfRefreshPromise;
        csrfRefreshPromise = (async function () {
            try {
                var response = await originalFetch(getDefaultApiBase() + '/auth/me', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    if (response.status === 401) setCsrf('');
                    return false;
                }
                var data = await response.json().catch(function () { return {}; });
                if (data && data.csrf_token) {
                    setCsrf(data.csrf_token);
                    if (data.user) {
                        window.dispatchEvent(new CustomEvent('operartis:auth-state', { detail: { user: data.user } }));
                    }
                    return true;
                }
            } catch (error) { }
            return false;
        })();
        try {
            return await csrfRefreshPromise;
        } finally {
            csrfRefreshPromise = null;
        }
    }

    async function fetchWithAuth(input, init) {
        var apiRequest = isApiRequest(input);
        var unsafe = isUnsafeMethod(init);
        if (apiRequest && unsafe && !isCsrfBootstrapExempt(input) && !csrfToken) {
            await refreshCsrfToken();
        }

        var options = apiRequest ? withAuthOptions(init) : init;
        var response = await originalFetch(input, options);

        if (apiRequest && unsafe && response.status === 403 && !isCsrfBootstrapExempt(input)) {
            var refreshed = await refreshCsrfToken();
            if (refreshed) {
                response = await originalFetch(input, withAuthOptions(init));
            }
        }

        if (apiRequest && response.status === 401 && shouldDispatchUnauthorized(input)) {
            window.dispatchEvent(new CustomEvent('operartis:unauthorized'));
        }
        return response;
    }

    window.fetch = function (input, init) {
        return fetchWithAuth(input, init);
    };

    async function apiFetch(path, init) {
        var base = getDefaultApiBase();
        var url = path.indexOf('http') === 0 ? path : base + path;
        var response = await fetchWithAuth(url, init);
        if (response.status === 401 && shouldDispatchUnauthorized(url)) {
            window.dispatchEvent(new CustomEvent('operartis:unauthorized'));
        }
        return response;
    }

    function readErrorMessage(data, fallback) {
        if (!data) return fallback;
        if (typeof data.detail === 'string') return data.detail;
        if (Array.isArray(data.detail)) {
            var messages = data.detail.map(function (item) {
                if (typeof item === 'string') return item;
                return item && (item.msg || item.message || item.detail);
            }).filter(Boolean);
            return messages.join(' ') || fallback;
        }
        if (data.detail && typeof data.detail === 'object') {
            return data.detail.message || data.detail.msg || fallback;
        }
        if (typeof data.message === 'string') return data.message;
        return fallback;
    }

    async function parseJsonResponse(response) {
        var data = await response.json().catch(function () { return {}; });
        if (!response.ok) {
            throw new Error(readErrorMessage(data, 'Request failed'));
        }
        return data;
    }

    async function me() {
        var response = await apiFetch('/auth/me', { method: 'GET' });
        var data = await parseJsonResponse(response);
        setCsrf(data.csrf_token);
        return data.user;
    }

    async function login(email, password) {
        var response = await apiFetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        var data = await parseJsonResponse(response);
        setCsrf(data.csrf_token);
        broadcastAuthEvent('login');
        return data.user;
    }

    async function requestPasswordReset(email) {
        var response = await apiFetch('/auth/password/reset/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        return parseJsonResponse(response);
    }

    async function confirmPasswordReset(email, token, newPassword) {
        var response = await apiFetch('/auth/password/reset/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, token: token, new_password: newPassword })
        });
        return parseJsonResponse(response);
    }

    async function logout() {
        await apiFetch('/auth/logout', { method: 'POST' }).catch(function () { });
        setCsrf('');
        broadcastAuthEvent('logout');
        window.dispatchEvent(new CustomEvent('operartis:logged-out'));
    }

    window.OperartisApi = {
        apiFetch: apiFetch,
        getDefaultApiBase: getDefaultApiBase,
        getCsrf: function () { return csrfToken; },
        setCsrf: setCsrf,
        me: me,
        login: login,
        requestPasswordReset: requestPasswordReset,
        confirmPasswordReset: confirmPasswordReset,
        logout: logout
    };
})();
