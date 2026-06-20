(function () {
    if (!window.OperartisApi) return;

    var state = { user: null };
    var autoPrompt = window.OPERARTIS_AUTH_AUTO_PROMPT !== false;
    var dismissible = window.OPERARTIS_AUTH_DISMISSIBLE === true || !autoPrompt;
    var showFloatingAccount = window.OPERARTIS_AUTH_FLOATING_ACCOUNT !== false;
    var themeObserverStarted = false;

    function addStyles() {
        if (document.getElementById('operartis-auth-style')) return;
        var style = document.createElement('style');
        style.id = 'operartis-auth-style';
        style.textContent = [
            '.op-auth-overlay{--op-auth-overlay-bg:rgba(2,6,23,.86);--op-auth-card-bg:#0f172a;--op-auth-card-text:#f8fafc;--op-auth-muted:#94a3b8;--op-auth-label:#cbd5e1;--op-auth-border:rgba(148,163,184,.28);--op-auth-input-bg:#020617;--op-auth-input-text:#f8fafc;--op-auth-close-bg:rgba(148,163,184,.16);--op-auth-close-text:#cbd5e1;--op-auth-close-hover-bg:rgba(148,163,184,.28);--op-auth-close-hover-text:#f8fafc;--op-auth-error-text:#fecaca;--op-auth-error-bg:rgba(239,68,68,.14);--op-auth-error-border:rgba(248,113,113,.35);position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:var(--op-auth-overlay-bg);backdrop-filter:blur(14px);font-family:Inter,system-ui,sans-serif;padding:24px}',
            '.op-auth-overlay[data-auth-theme="light"]{--op-auth-overlay-bg:rgba(241,245,249,.78);--op-auth-card-bg:rgba(255,255,255,.94);--op-auth-card-text:#0f172a;--op-auth-muted:#475569;--op-auth-label:#334155;--op-auth-border:rgba(15,23,42,.16);--op-auth-input-bg:#f8fafc;--op-auth-input-text:#0f172a;--op-auth-close-bg:rgba(15,23,42,.08);--op-auth-close-text:#475569;--op-auth-close-hover-bg:rgba(15,23,42,.14);--op-auth-close-hover-text:#0f172a;--op-auth-error-text:#991b1b;--op-auth-error-bg:rgba(254,226,226,.92);--op-auth-error-border:rgba(248,113,113,.48)}',
            '.op-auth-overlay[data-open="true"]{display:flex}',
            '.op-auth-card{position:relative;width:min(420px,100%);background:var(--op-auth-card-bg);color:var(--op-auth-card-text);border:1px solid var(--op-auth-border);border-radius:10px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.34)}',
            '.op-auth-close{position:absolute;right:12px;top:12px;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:0;border-radius:999px;background:var(--op-auth-close-bg);color:var(--op-auth-close-text);font-size:18px;font-weight:900;line-height:1;cursor:pointer}',
            '.op-auth-close:hover{background:var(--op-auth-close-hover-bg);color:var(--op-auth-close-hover-text)}',
            '.op-auth-title{font-size:22px;font-weight:900;margin:0 0 6px}',
            '.op-auth-sub{font-size:13px;color:var(--op-auth-muted);margin:0 0 22px;line-height:1.5}',
            '.op-auth-field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}',
            '.op-auth-label{font-size:12px;font-weight:800;color:var(--op-auth-label);text-transform:uppercase;letter-spacing:.04em}',
            '.op-auth-input{height:44px;border-radius:8px;border:1px solid rgba(148,163,184,.32);background:var(--op-auth-input-bg);color:var(--op-auth-input-text);padding:0 12px;font-size:14px;outline:none}',
            '.op-auth-input:focus{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,.18)}',
            '.op-auth-button{height:44px;width:100%;border:0;border-radius:8px;background:#f59e0b;color:#111827;font-weight:900;cursor:pointer}',
            '.op-auth-error{display:none;color:var(--op-auth-error-text);background:var(--op-auth-error-bg);border:1px solid var(--op-auth-error-border);border-radius:8px;padding:10px 12px;font-size:13px;font-weight:800;line-height:1.4;margin-bottom:14px}',
            '.op-auth-account{position:fixed;right:18px;bottom:18px;z-index:99990;display:none;gap:8px;align-items:center;background:rgba(15,23,42,.92);color:#e2e8f0;border:1px solid rgba(148,163,184,.28);border-radius:999px;padding:8px 10px;font:700 12px Inter,system-ui,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,.22)}',
            '.op-auth-account[data-auth-theme="light"]{background:rgba(255,255,255,.92);color:#0f172a;border-color:rgba(15,23,42,.14)}',
            '.op-auth-account[data-open="true"]{display:flex}',
            '.op-auth-logout{border:0;border-radius:999px;background:#334155;color:#fff;font-weight:800;font-size:11px;padding:6px 9px;cursor:pointer}'
        ].join('');
        document.head.appendChild(style);
    }

    function resolveAuthTheme() {
        if (typeof window.getOperartisTheme === 'function') {
            var theme = window.getOperartisTheme();
            if (theme === 'light') return 'light';
            if (theme === 'dark') return 'dark';
            if (theme === 'system') {
                try {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                } catch (e) {
                    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                }
            }
        }
        if (document.documentElement.classList.contains('dark')) return 'dark';
        return typeof window.getOperartisTheme === 'function' ? 'light' : 'dark';
    }

    function syncAuthTheme() {
        var theme = resolveAuthTheme();
        var overlay = document.getElementById('operartis-auth-overlay');
        var account = document.getElementById('operartis-auth-account');
        if (overlay) overlay.setAttribute('data-auth-theme', theme);
        if (account) account.setAttribute('data-auth-theme', theme);
    }

    function observeThemeChanges() {
        if (themeObserverStarted) return;
        themeObserverStarted = true;
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(syncAuthTheme);
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        }
        try {
            var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', syncAuthTheme);
            else if (mediaQuery.addListener) mediaQuery.addListener(syncAuthTheme);
        } catch (e) { }
    }

    function buildUi() {
        addStyles();
        if (document.getElementById('operartis-auth-overlay')) return;

        var overlay = document.createElement('div');
        overlay.id = 'operartis-auth-overlay';
        overlay.className = 'op-auth-overlay';
        overlay.innerHTML = [
            '<form class="op-auth-card" id="operartis-auth-form">',
            dismissible ? '<button class="op-auth-close" id="operartis-auth-close" type="button" aria-label="Close login" title="Close login">&times;</button>' : '',
            '<h1 class="op-auth-title">Operartis Login</h1>',
            '<p class="op-auth-sub">Sign in with your invited account to use the optimization modules.</p>',
            '<div class="op-auth-error" id="operartis-auth-error" role="alert" aria-live="polite"></div>',
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
        if (dismissible) {
            document.getElementById('operartis-auth-close').addEventListener('click', hideUi);
            overlay.addEventListener('click', function (event) {
                if (event.target === overlay) hideUi();
            });
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') hideUi();
            });
        }
        account.querySelector('button').addEventListener('click', async function () {
            await window.OperartisApi.logout();
            showLogin();
        });
        observeThemeChanges();
        syncAuthTheme();
    }

    function setError(message) {
        var error = document.getElementById('operartis-auth-error');
        if (!error) return;
        error.textContent = message || '';
        error.style.display = message ? 'block' : 'none';
    }

    function showLogin() {
        buildUi();
        syncAuthTheme();
        document.getElementById('operartis-auth-overlay').setAttribute('data-open', 'true');
        document.getElementById('operartis-auth-account').removeAttribute('data-open');
        setError('');
    }

    function hideUi() {
        buildUi();
        syncAuthTheme();
        document.getElementById('operartis-auth-overlay').removeAttribute('data-open');
        document.getElementById('operartis-auth-account').removeAttribute('data-open');
        setError('');
    }

    function showAccount(user) {
        buildUi();
        syncAuthTheme();
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
            setError(error.message || 'Login failed. Please check your email and password.');
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
