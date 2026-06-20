(function () {
    if (!window.OperartisApi) return;

    var state = { user: null };
    var autoPrompt = window.OPERARTIS_AUTH_AUTO_PROMPT !== false;
    var dismissible = window.OPERARTIS_AUTH_DISMISSIBLE === true || !autoPrompt;
    var showFloatingAccount = window.OPERARTIS_AUTH_FLOATING_ACCOUNT !== false;
    var themeObserverStarted = false;
    var langObserverStarted = false;
    var authCopy = {
        en: {
            title: 'Operartis Login',
            subtitle: 'Sign in with your invited account to use the optimization modules.',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
            signingIn: 'Signing in...',
            closeLogin: 'Close login',
            logout: 'Logout',
            loginFailed: 'Login failed. Please check your email and password.',
            invalidCredentials: 'Invalid email or password.',
            showPassword: 'Show password',
            hidePassword: 'Hide password',
            accountPrompt: 'Still do not have your own account?',
            contactOperartis: 'Contact Operartis!',
            contactTitle: 'Email Operartis'
        },
        vi: {
            title: 'Đăng Nhập Operartis',
            subtitle: 'Đăng nhập bằng tài khoản đã được mời để sử dụng các module tối ưu hóa.',
            email: 'Email',
            password: 'Mật Khẩu',
            signIn: 'Đăng Nhập',
            signingIn: 'Đang đăng nhập...',
            closeLogin: 'Đóng cửa sổ đăng nhập',
            logout: 'Đăng Xuất',
            loginFailed: 'Đăng nhập không thành công. Vui lòng kiểm tra email và mật khẩu.',
            invalidCredentials: 'Email hoặc mật khẩu không đúng.',
            showPassword: 'Hiển thị mật khẩu',
            hidePassword: 'Ẩn mật khẩu',
            accountPrompt: 'Bạn vẫn chưa có tài khoản riêng?',
            contactOperartis: 'Liên hệ Operartis!',
            contactTitle: 'Gửi email cho Operartis'
        }
    };

    function authLang() {
        var lang = '';
        if (typeof window.getOperartisLang === 'function') lang = window.getOperartisLang();
        if (!lang && document.documentElement.lang) lang = document.documentElement.lang;
        lang = String(lang || 'en').toLowerCase().split('-')[0];
        return authCopy[lang] ? lang : 'en';
    }

    function t(key) {
        var copy = authCopy[authLang()] || authCopy.en;
        return copy[key] || authCopy.en[key] || key;
    }

    function localizeError(message) {
        if (!message) return t('loginFailed');
        if (message === authCopy.en.invalidCredentials || message === authCopy.vi.invalidCredentials) {
            return t('invalidCredentials');
        }
        if (message === authCopy.en.loginFailed || message === authCopy.vi.loginFailed) {
            return t('loginFailed');
        }
        return message;
    }

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
            '.op-auth-input{height:44px;width:100%;border-radius:8px;border:1px solid rgba(148,163,184,.32);background:var(--op-auth-input-bg);color:var(--op-auth-input-text);padding:0 12px;font-size:14px;outline:none}',
            '.op-auth-input:focus{border-color:#f59e0b;box-shadow:0 0 0 2px rgba(245,158,11,.18)}',
            '.op-auth-password-wrap{position:relative;display:flex;align-items:center;width:100%}',
            '.op-auth-password-wrap .op-auth-input{padding-right:46px}',
            '.op-auth-password-toggle{position:absolute;right:7px;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:var(--op-auth-muted);cursor:pointer;padding:0}',
            '.op-auth-password-toggle:hover{background:var(--op-auth-close-bg);color:var(--op-auth-card-text)}',
            '.op-auth-password-toggle:focus-visible{outline:2px solid rgba(245,158,11,.6);outline-offset:2px}',
            '.op-auth-password-toggle svg{width:18px;height:18px;stroke:currentColor}',
            '.op-auth-button{height:44px;width:100%;border:0;border-radius:8px;background:#f59e0b;color:#ffffff;font-weight:900;cursor:pointer}',
            '.op-auth-contact{margin:12px 0 0;color:var(--op-auth-muted);font-size:12px;line-height:1.5;text-align:center}',
            '.op-auth-contact a{color:#d97706;font-weight:900;text-decoration:none}',
            '.op-auth-contact a:hover{text-decoration:underline}',
            '.op-auth-contact a:focus-visible{outline:2px solid rgba(245,158,11,.55);outline-offset:3px;border-radius:4px}',
            '.op-auth-error{display:none;color:var(--op-auth-error-text);background:var(--op-auth-error-bg);border:1px solid var(--op-auth-error-border);border-radius:8px;padding:10px 12px;font-size:13px;font-weight:800;line-height:1.4;margin-bottom:14px}',
            '.op-auth-account{position:fixed;right:18px;bottom:18px;z-index:99990;display:none;gap:8px;align-items:center;background:rgba(15,23,42,.92);color:#e2e8f0;border:1px solid rgba(148,163,184,.28);border-radius:999px;padding:8px 10px;font:700 12px Inter,system-ui,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,.22)}',
            '.op-auth-account[data-auth-theme="light"]{background:rgba(255,255,255,.92);color:#0f172a;border-color:rgba(15,23,42,.14)}',
            '.op-auth-account[data-open="true"]{display:flex}',
            '.op-auth-logout{border:0;border-radius:999px;background:#334155;color:#fff;font-weight:800;font-size:11px;padding:6px 9px;cursor:pointer}'
        ].join('');
        document.head.appendChild(style);
    }

    function passwordIcon(visible) {
        if (visible) {
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12a18.15 18.15 0 0 1 5.06-7.94"/><path d="M9.9 4.24A10.86 10.86 0 0 1 12 4c5 0 9.27 3.11 11 8a18.2 18.2 0 0 1-3.22 5.02"/><path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>';
        }
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.06 12.35a11.13 11.13 0 0 1 19.88 0"/><path d="M21.94 11.65a11.13 11.13 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/></svg>';
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

    function syncAuthLanguage() {
        var title = document.getElementById('operartis-auth-title');
        var subtitle = document.getElementById('operartis-auth-subtitle');
        var emailLabel = document.getElementById('operartis-auth-email-label-text');
        var passwordLabel = document.getElementById('operartis-auth-password-label-text');
        var submit = document.getElementById('operartis-auth-submit');
        var close = document.getElementById('operartis-auth-close');
        var logout = document.getElementById('operartis-auth-logout');
        var passwordInput = document.getElementById('operartis-auth-password');
        var passwordToggle = document.getElementById('operartis-auth-password-toggle');
        var contactPrompt = document.getElementById('operartis-auth-contact-prompt');
        var contactLink = document.getElementById('operartis-auth-contact-link');

        if (title) title.textContent = t('title');
        if (subtitle) subtitle.textContent = t('subtitle');
        if (emailLabel) emailLabel.textContent = t('email');
        if (passwordLabel) passwordLabel.textContent = t('password');
        if (submit && !submit.disabled) submit.textContent = t('signIn');
        if (close) {
            close.setAttribute('aria-label', t('closeLogin'));
            close.setAttribute('title', t('closeLogin'));
        }
        if (logout) logout.textContent = t('logout');
        if (passwordInput && passwordToggle) {
            var visible = passwordInput.type === 'text';
            passwordToggle.setAttribute('aria-label', visible ? t('hidePassword') : t('showPassword'));
            passwordToggle.setAttribute('title', visible ? t('hidePassword') : t('showPassword'));
        }
        if (contactPrompt) contactPrompt.textContent = t('accountPrompt') + ' ';
        if (contactLink) {
            contactLink.textContent = t('contactOperartis');
            contactLink.setAttribute('title', t('contactTitle'));
        }
    }

    function observeLanguageChanges() {
        if (langObserverStarted) return;
        langObserverStarted = true;
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(syncAuthLanguage);
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        }
        window.addEventListener('storage', function (event) {
            if (event.key === 'lang') syncAuthLanguage();
        });
    }

    function buildUi() {
        addStyles();
        if (document.getElementById('operartis-auth-overlay')) return;

        var overlay = document.createElement('div');
        overlay.id = 'operartis-auth-overlay';
        overlay.className = 'op-auth-overlay';
        overlay.innerHTML = [
            '<form class="op-auth-card" id="operartis-auth-form">',
            dismissible ? '<button class="op-auth-close" id="operartis-auth-close" type="button">&times;</button>' : '',
            '<h1 class="op-auth-title" id="operartis-auth-title"></h1>',
            '<p class="op-auth-sub" id="operartis-auth-subtitle"></p>',
            '<div class="op-auth-error" id="operartis-auth-error" role="alert" aria-live="polite"></div>',
            '<label class="op-auth-field"><span class="op-auth-label" id="operartis-auth-email-label-text"></span><input class="op-auth-input" id="operartis-auth-email" type="email" autocomplete="email" required></label>',
            '<label class="op-auth-field"><span class="op-auth-label" id="operartis-auth-password-label-text"></span><span class="op-auth-password-wrap"><input class="op-auth-input" id="operartis-auth-password" type="password" autocomplete="current-password" required><button class="op-auth-password-toggle" id="operartis-auth-password-toggle" type="button" aria-pressed="false"></button></span></label>',
            '<button class="op-auth-button" id="operartis-auth-submit" type="submit"></button>',
            '<p class="op-auth-contact"><span id="operartis-auth-contact-prompt"></span><a id="operartis-auth-contact-link" href="mailto:info@operartis.io"></a></p>',
            '</form>'
        ].join('');
        document.body.appendChild(overlay);

        var account = document.createElement('div');
        account.id = 'operartis-auth-account';
        account.className = 'op-auth-account';
        account.innerHTML = '<span id="operartis-auth-email-label"></span><button class="op-auth-logout" id="operartis-auth-logout" type="button"></button>';
        document.body.appendChild(account);

        document.getElementById('operartis-auth-form').addEventListener('submit', async function (event) {
            event.preventDefault();
            await handleLogin();
        });
        document.getElementById('operartis-auth-password-toggle').addEventListener('click', function () {
            var passwordInput = document.getElementById('operartis-auth-password');
            var toggle = document.getElementById('operartis-auth-password-toggle');
            var visible = passwordInput.type === 'password';
            passwordInput.type = visible ? 'text' : 'password';
            toggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
            toggle.innerHTML = passwordIcon(visible);
            syncAuthLanguage();
            passwordInput.focus();
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
        observeLanguageChanges();
        syncAuthTheme();
        syncAuthLanguage();
        document.getElementById('operartis-auth-password-toggle').innerHTML = passwordIcon(false);
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
        syncAuthLanguage();
        document.getElementById('operartis-auth-overlay').setAttribute('data-open', 'true');
        document.getElementById('operartis-auth-account').removeAttribute('data-open');
        setError('');
    }

    function hideUi() {
        buildUi();
        syncAuthTheme();
        syncAuthLanguage();
        document.getElementById('operartis-auth-overlay').removeAttribute('data-open');
        document.getElementById('operartis-auth-account').removeAttribute('data-open');
        setError('');
    }

    function showAccount(user) {
        buildUi();
        syncAuthTheme();
        syncAuthLanguage();
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
        button.textContent = t('signingIn');
        setError('');
        try {
            var user = await window.OperartisApi.login(email, password);
            showAccount(user);
        } catch (error) {
            setError(localizeError(error.message));
        } finally {
            button.disabled = false;
            button.textContent = t('signIn');
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
