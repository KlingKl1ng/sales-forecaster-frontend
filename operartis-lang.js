(function () {
    var VALID = { en: 1, vi: 1 };

    function readStorage(key) {
        try {
            return window.localStorage && window.localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            if (window.localStorage) window.localStorage.setItem(key, value);
        } catch (e) { }
    }

    function removeStorage(key) {
        try {
            if (window.localStorage) window.localStorage.removeItem(key);
        } catch (e) { }
    }

    window.getOperartisLang = function () {
        var lang = readStorage('lang');
        if (VALID[lang]) return lang;

        var legacy = readStorage('preferredLang') || readStorage('inv-lang');
        if (VALID[legacy]) {
            writeStorage('lang', legacy);
            removeStorage('preferredLang');
            removeStorage('inv-lang');
            return legacy;
        }

        return 'vi';
    };

    window.persistOperartisLang = function (lang) {
        if (VALID[lang]) writeStorage('lang', lang);
    };
})();
