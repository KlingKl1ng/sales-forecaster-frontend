(function () {
    var VALID = { en: 1, vi: 1, de: 1 };

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
        var lang = localStorage.getItem('lang');
        if (VALID[lang]) return lang;

        var legacy = localStorage.getItem('preferredLang') || localStorage.getItem('inv-lang');
        if (VALID[legacy]) {
            localStorage.setItem('lang', legacy);
            try {
                localStorage.removeItem('preferredLang');
                localStorage.removeItem('inv-lang');
            } catch (e) { }
            return legacy;
        }

        return detectBrowserLang();
    };

    window.persistOperartisLang = function (lang) {
        if (VALID[lang]) {
            localStorage.setItem('lang', lang);
            try {
                document.documentElement.lang = lang;
            } catch (e) { }
            window.dispatchEvent(new CustomEvent('operartis:lang-change', { detail: { lang: lang } }));
        }
    };

    try {
        document.documentElement.lang = window.getOperartisLang();
    } catch (e) { }
})();
