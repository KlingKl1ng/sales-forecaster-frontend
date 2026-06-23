(function () {
    var VALID = { light: 1, dark: 1, system: 1 };
    var STORAGE_KEY = 'theme';

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
        if (!VALID[theme]) theme = 'system';
        var systemDark = false;
        try { systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { }
        var dark = theme === 'dark' || (theme === 'system' && systemDark);
        try {
            document.documentElement.classList.toggle('dark', dark);
            document.documentElement.classList.remove('light');
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

    try {
        window.applyOperartisThemeClass(window.getOperartisTheme());
    } catch (e) { }

    try {
        window.addEventListener('storage', onStorage);
    } catch (e) { }

    try {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onSystemPreferenceChange);
        else if (typeof mq.addListener === 'function') mq.addListener(onSystemPreferenceChange);
    } catch (e) { }
})();
