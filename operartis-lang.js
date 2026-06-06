(function () {
    var VALID = { en: 1, vi: 1, de: 1 };

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

        return 'vi';
    };

    window.persistOperartisLang = function (lang) {
        if (VALID[lang]) localStorage.setItem('lang', lang);
    };
})();
