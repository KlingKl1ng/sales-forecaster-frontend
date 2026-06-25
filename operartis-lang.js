(function () {
    var VALID = { en: 1, vi: 1, de: 1 };
    var STORAGE_KEY = 'lang';

    function detectBrowserLang() {
        var languages = [];
        if (Array.isArray(navigator.languages)) languages = navigator.languages;
        else if (navigator.language) languages = [navigator.language];

        for (var i = 0; i < languages.length; i += 1) {
            var code = String(languages[i] || '').toLowerCase().split('-')[0];
            if (VALID[code]) return code;
        }

        return 'en';
    }

    window.getOperartisLang = function () {
        var lang = null;
        try { lang = localStorage.getItem(STORAGE_KEY); } catch (e) { }
        if (VALID[lang]) return lang;

        var legacy = null;
        try { legacy = localStorage.getItem('preferredLang') || localStorage.getItem('inv-lang'); } catch (e) { }
        if (VALID[legacy]) {
            try { localStorage.setItem(STORAGE_KEY, legacy); } catch (e) { }
            try {
                localStorage.removeItem('preferredLang');
                localStorage.removeItem('inv-lang');
            } catch (e) { }
            return legacy;
        }

        return detectBrowserLang();
    };

    function notifyLangChange(lang) {
        try {
            window.dispatchEvent(new CustomEvent('operartis:lang-change', { detail: { lang: lang } }));
        } catch (e) { }
    }

    function applyLang(lang) {
        if (!VALID[lang]) lang = window.getOperartisLang();
        try {
            document.documentElement.lang = lang;
        } catch (e) { }
        notifyLangChange(lang);
        return lang;
    }

    window.persistOperartisLang = function (lang) {
        if (!VALID[lang]) return window.getOperartisLang();
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { }
        try {
            localStorage.removeItem('preferredLang');
            localStorage.removeItem('inv-lang');
        } catch (e) { }
        return applyLang(lang);
    };

    window.setOperartisLang = window.persistOperartisLang;

    function onStorage(event) {
        if (!event || (event.key !== STORAGE_KEY && event.key !== 'preferredLang' && event.key !== 'inv-lang')) return;
        applyLang(window.getOperartisLang());
    }

    try {
        document.documentElement.lang = window.getOperartisLang();
    } catch (e) { }

    try {
        window.addEventListener('storage', onStorage);
    } catch (e) { }
})();
