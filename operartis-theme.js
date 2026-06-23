(function () {
    var VALID = { light: 1, dark: 1, system: 1 };
    var STORAGE_KEY = 'theme';

    function ensureThemeBridgeStyles() {
        if (document.getElementById('operartis-theme-bridge')) return;
        var style = document.createElement('style');
        style.id = 'operartis-theme-bridge';
        style.textContent = [
            'html { color-scheme: light dark; }',
            'html[data-operartis-color-mode="light"] { color-scheme: light; }',
            'html[data-operartis-color-mode="dark"] { color-scheme: dark; }',
            'html[data-operartis-color-mode="light"] body { background-color: #f8fafc; }',
            'html[data-operartis-color-mode="dark"] body { background-color: #0f172a; }'
        ].join('\n');
        document.head.appendChild(style);
    }

    window.getOperartisTheme = function () {
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { }
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;

        var session = null;
        try { session = sessionStorage.getItem(STORAGE_KEY); } catch (e) { }
        if (session === 'light' || session === 'dark') return session;

        return 'system';
    };

    window.applyOperartisThemeClass = function (theme) {
        ensureThemeBridgeStyles();
        if (!VALID[theme]) theme = 'system';
        var systemDark = false;
        try { systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { }
        var dark = theme === 'dark' || (theme === 'system' && systemDark);
        var root = document.documentElement;
        try {
            root.classList.toggle('dark', dark);
            root.classList.remove('light');
            root.setAttribute('data-operartis-color-mode', dark ? 'dark' : 'light');
            root.setAttribute('data-operartis-theme', theme);
            root.style.colorScheme = dark ? 'dark' : 'light';
            void root.offsetHeight;
        } catch (e) { }
        return dark;
    };

    window.persistOperartisTheme = function (theme) {
        if (!VALID[theme]) return;
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { }
        try {
            if (theme === 'system') sessionStorage.removeItem(STORAGE_KEY);
            else sessionStorage.setItem(STORAGE_KEY, theme);
        } catch (e) { }
    };

    window.setOperartisTheme = function (theme) {
        if (!VALID[theme]) return window.getOperartisTheme();
        window.persistOperartisTheme(theme);
        window.applyOperartisThemeClass(theme);
        notifyThemeChange(theme);
        return theme;
    };

    function notifyThemeChange(theme) {
        try {
            window.dispatchEvent(new CustomEvent('operartis:theme-change', { detail: { theme: theme } }));
        } catch (e) { }
    }

    function onStorage(event) {
        if (!event || event.key !== STORAGE_KEY) return;
        var theme = window.getOperartisTheme();
        window.applyOperartisThemeClass(theme);
        notifyThemeChange(theme);
    }

    function onSystemPreferenceChange() {
        if (window.getOperartisTheme() !== 'system') return;
        window.applyOperartisThemeClass('system');
        notifyThemeChange('system');
    }

    function bindThemeOptionClicks() {
        document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target || !target.closest) return;
            var button = target.closest('[data-operartis-theme]');
            if (!button || button.disabled) return;
            var theme = button.getAttribute('data-operartis-theme');
            if (!VALID[theme]) return;
            event.preventDefault();
            window.setOperartisTheme(theme);
        }, true);
    }

    function reapplyStoredTheme() {
        try {
            window.applyOperartisThemeClass(window.getOperartisTheme());
        } catch (e) { }
    }

    try {
        bindThemeOptionClicks();
    } catch (e) { }

    try {
        reapplyStoredTheme();
    } catch (e) { }

    try {
        window.addEventListener('storage', onStorage);
    } catch (e) { }

    try {
        window.addEventListener('pageshow', function (event) {
            if (event && event.persisted) reapplyStoredTheme();
        });
    } catch (e) { }

    try {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onSystemPreferenceChange);
        else if (typeof mq.addListener === 'function') mq.addListener(onSystemPreferenceChange);
    } catch (e) { }
})();
