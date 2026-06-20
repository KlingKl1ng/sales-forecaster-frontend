(function () {
    if (!window.OperartisApi) return;

    var state = { user: null };
    var autoPrompt = window.OPERARTIS_AUTH_AUTO_PROMPT !== false;
    var showFloatingAccount = window.OPERARTIS_AUTH_FLOATING_ACCOUNT !== false;

    function addStyles() {
        if (document.getElementById('operartis-auth-style')) return;
        var style = document.createElement('style');
        style.id = 'operartis-auth-style';
        style.textContent = [
            '.op-auth-overlay{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.86);backdrop-filter:blur(14px);font-family:Inter,system-ui,sans-serif;padding:24px}',
            '.op-auth-overlay[data-open="true"]{display:flex}',
            '.op-auth-card{width:min(420px,100%);background:#0f172a;color:#f8fafc;border:1px solid rgba(148,163,184,.28);border-radius:10px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.42)}',
            '.op-auth-title{font-size:22px;font-weight:900;margin:0 0 6px}',
            '.op-auth-sub{font-size:13px;color:#94a3b8;margin:0 0 22px;line-height:1.5}',
            '.op-auth-field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}',
            '.op-auth-label{font-size:12px;font-weight:800;color:#cbd5e1;text-transform:uppercase;letter-spacing:.04em}',
            '.op-auth-input{height:44px;border-radius:8px;border:1px solid rgba(148,163,184,.32);background:#020617;color:#f8fafc;padding:0 12px;font-size:14px;outline:none}',
            '.op-auth-input:focus{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,.18)}',
            '.op-auth-button{height:44px;width:100%;border:0;border-radius:8px;background:#f59e0b;color:#111827;font-weight:900;cursor:pointer}',
            '.op-auth-error{display:none;color:#fecaca;background:rgba(239,68,68,.14);border:1px solid rgba(248,113,113,.35);border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:14px}',
            '.op-auth-account{position:fixed;right:18px;bottom:18px;z-index:99990;display:none;gap:8px;align-items:center;background:rgba(15,23,42,.92);color:#e2e8f0;border:1px solid rgba(148,163,184,.28);border-radius:999px;padding:8px 10px;font:700 12px Inter,system-ui,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,.22)}',
            '.op-auth-account[data-open="true"]{display:flex}',
            '.op-auth-logout{border:0;border-radius:999px;background:#334155;color:#fff;font-weight:800;font-size:11px;padding:6px 9px;cursor:pointer}'
        ].join('');
        document.head.appendChild(style);
    }

    function buildUi() {
        addStyles();
        if (document.getElementById('operartis-auth-overlay')) return;

        var overlay = document.createElement('div');
        overlay.id = 'operartis-auth-overlay';
        overlay.className = 'op-auth-overlay';
        overlay.innerHTML = [
            '<form class="op-auth-card" id="operartis-auth-form">',
            '<h1 class="op-auth-title">Operartis Login</h1>',
            '<p class="op-auth-sub">Sign in with your invited account to use the optimization modules.</p>',
            '<div class="op-auth-error" id="operartis-auth-error"></div>',
            '<label class="op-auth-field"><span class="op-auth-label">Email</span><input class="op-auth-input" id="operartis-auth-email" type="email" autocomplete="email" required></label>',
            '<label class="op-auth-field"><span class="op-auth-label">Password</span><input class="op-auth-input" id="operartis-auth-password" type="password" autocomplete="current-password" required></label>',
            '<button class="op-auth-button" id="operartis-auth-submit" type="submit">Sign In</button>',
            '</form>'
        ].join('');
        document.body.appendChild(overlay);

        var account = document.createElement('div');
        account.id = 'operartis-auth-account';
        account.className = 'op-auth-account';
        account.innerHTML = '<span id="operartis-auth-email-label"></span><button class="op-auth-logout" type="button">Logout</button>';
        document.body.appendChild(account);

        document.getElementById('operartis-auth-form').addEventListener('submit', async function (event) {
            event.preventDefault();
            await handleLogin();
        });
        account.querySelector('button').addEventListener('click', async function () {
            await window.OperartisApi.logout();
            showLogin();
        });
    }

    function setError(message) {
        var error = document.getElementById('operartis-auth-error');
        if (!error) return;
        error.textContent = message || '';
        error.style.display = message ? 'block' : 'none';
    }

    function showLogin() {
        buildUi();
        document.getElementById('operartis-auth-overlay').setAttribute('data-open', 'true');
        document.getElementById('operartis-auth-account').removeAttribute('data-open');
        setError('');
    }

    function hideUi() {
        buildUi();
        document.getElementById('operartis-auth-overlay').removeAttribute('data-open');
        document.getElementById('operartis-auth-account').removeAttribute('data-open');
        setError('');
    }

    function showAccount(user) {
        buildUi();
        state.user = user;
        document.getElementById('operartis-auth-overlay').removeAttribute('data-open');
        if (showFloatingAccount) document.getElementById('operartis-auth-account').setAttribute('data-open', 'true');
        else document.getElementById('operartis-auth-account').removeAttribute('data-open');
        document.getElementById('operartis-auth-email-label').textContent = user.email;
        window.dispatchEvent(new CustomEvent('operartis:authenticated', { detail: { user: user } }));
    }

    async function handleLogin() {
        var email = document.getElementById('operartis-auth-email').value;
        var password = document.getElementById('operartis-auth-password').value;
        var button = document.getElementById('operartis-auth-submit');
        button.disabled = true;
        button.textContent = 'Signing in...';
        setError('');
        try {
            var user = await window.OperartisApi.login(email, password);
            showAccount(user);
        } catch (error) {
            setError(error.message || 'Login failed');
        } finally {
            button.disabled = false;
            button.textContent = 'Sign In';
        }
    }

    function handleUnauthenticated() {
        state.user = null;
        if (autoPrompt) showLogin();
        else hideUi();
        window.dispatchEvent(new CustomEvent('operartis:auth-state', { detail: { user: null } }));
    }

    async function refresh() {
        buildUi();
        try {
            var user = await window.OperartisApi.me();
            showAccount(user);
            window.dispatchEvent(new CustomEvent('operartis:auth-state', { detail: { user: user } }));
            return user;
        } catch (error) {
            handleUnauthenticated();
            throw error;
        }
    }

    async function logout() {
        await window.OperartisApi.logout();
        handleUnauthenticated();
    }

    window.OperartisAuth = {
        showLogin: showLogin,
        refresh: refresh,
        logout: logout,
        getUser: function () { return state.user; }
    };

    window.addEventListener('operartis:unauthorized', handleUnauthenticated);
    window.addEventListener('operartis:logged-out', handleUnauthenticated);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { refresh().catch(function () { }); });
    else refresh().catch(function () { });
})();
