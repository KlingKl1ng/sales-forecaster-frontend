(function () {
    const catalog = window.OperartisLanguageCatalog || [];
    const byCode = new Map(catalog.map(entry => [entry[0], entry]));
    const displayNames = new Map(), searchCatalogs = new Map();
    const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    function label(code, lang) {
        try {
            if (!displayNames.has(lang)) displayNames.set(lang, new Intl.DisplayNames([lang], {type: 'language', fallback: 'none'}));
            return displayNames.get(lang).of(code) || byCode.get(code)?.[1] || code;
        } catch (_) { return byCode.get(code)?.[1] || code; }
    }
    function searchableLanguages(lang) {
        if (!searchCatalogs.has(lang)) {
            const entries = catalog.map(entry => {
                const [code, ...names] = entry;
                const name = label(code, lang);
                const native = code.length === 2 ? label(code, code) : '';
                return {code, name, native, search: normalize([code, name, native, ...names].join(' '))};
            });
            entries.sort((a, b) => a.name.localeCompare(b.name, lang, {sensitivity: 'base'}) || a.code.localeCompare(b.code));
            searchCatalogs.set(lang, entries);
        }
        return searchCatalogs.get(lang);
    }
    function mount(root, t, getLanguage) {
        let selected = [], opened = false, matches = [], shown = 0, active = -1;
        root.className = 'profile-language-picker';
        root.innerHTML = '<label class="language-picker-label"></label><button type="button" class="language-picker-trigger" aria-haspopup="dialog" aria-expanded="false"><span></span><svg class="language-picker-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></button>';
        const labelNode = root.querySelector('label'), trigger = root.querySelector('button'), summary = trigger.firstChild;
        trigger.id = root.id + '-trigger'; labelNode.htmlFor = trigger.id;
        const panel = document.createElement('div');
        panel.className = 'language-picker-panel'; panel.hidden = true; panel.id = root.id + '-panel';
        panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false');
        panel.innerHTML = '<input type="search" class="language-picker-search" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="true"><div class="language-picker-list" role="listbox" aria-multiselectable="true"></div><p class="language-picker-status" role="status" aria-live="polite"></p>';
        document.body.appendChild(panel); trigger.setAttribute('aria-controls', panel.id);
        const search = panel.querySelector('input'), list = panel.querySelector('.language-picker-list'), status = panel.querySelector('p');
        list.id = root.id + '-options'; search.setAttribute('aria-controls', list.id);
        function updateText() {
            labelNode.textContent = t('profile_languages.label');
            panel.setAttribute('aria-label', t('profile_languages.label'));
            list.setAttribute('aria-label', t('profile_languages.label'));
            search.placeholder = t('profile_languages.search'); search.setAttribute('aria-label', t('profile_languages.search'));
            summary.textContent = selected.length ? selected.map(code => label(code, getLanguage())).join(', ') : t('profile_languages.placeholder');
            trigger.title = summary.textContent;
            status.textContent = selected.length >= 3 ? t('profile_languages.limit') : t('profile_languages.count', {count: selected.length});
        }
        function place() {
            const rect = trigger.getBoundingClientRect(), gap = 6, edge = 8;
            const below = innerHeight - rect.bottom - gap - edge, above = rect.top - gap - edge;
            const useAbove = below < 260 && above > below;
            const height = Math.max(100, Math.min(340, useAbove ? above : below));
            const width = Math.min(Math.max(rect.width, 300), innerWidth - 2 * edge);
            panel.style.width = width + 'px'; panel.style.maxHeight = height + 'px';
            panel.style.left = Math.max(edge, Math.min(rect.left, innerWidth - width - edge)) + 'px';
            panel.style.top = (useAbove ? Math.max(edge, rect.top - gap - height) : rect.bottom + gap) + 'px';
        }
        function close(restoreFocus = false) {
            if (!opened) return;
            opened = false; panel.hidden = true; trigger.setAttribute('aria-expanded', 'false');
            search.removeAttribute('aria-activedescendant');
            if (restoreFocus) trigger.focus();
        }
        function optionNode(item, index) {
            const button = document.createElement('button');
            button.type = 'button'; button.tabIndex = -1; button.id = root.id + '-option-' + item.code;
            button.className = 'language-picker-option'; button.setAttribute('role', 'option');
            button.setAttribute('aria-selected', String(selected.includes(item.code)));
            button.setAttribute('aria-disabled', String(selected.length >= 3 && !selected.includes(item.code)));
            button.setAttribute('aria-posinset', String(index + 1)); button.setAttribute('aria-setsize', String(matches.length));
            const name = document.createElement('span'); name.textContent = item.name;
            const code = document.createElement('small'); code.textContent = item.code;
            const check = document.createElement('span'); check.setAttribute('aria-hidden', 'true'); check.textContent = selected.includes(item.code) ? '✓' : '';
            button.append(name, code, check);
            button.addEventListener('mousedown', event => event.preventDefault());
            button.addEventListener('click', () => {toggle(item.code); search.focus();});
            return button;
        }
        function appendResults() {
            const end = Math.min(shown + 100, matches.length);
            const fragment = document.createDocumentFragment();
            for (let index = shown; index < end; index++) fragment.appendChild(optionNode(matches[index], index));
            list.appendChild(fragment); shown = end;
        }
        function renderResults() {
            const query = normalize(search.value.trim());
            const retained = selected.filter(code => !byCode.has(code)).map(code => {
                const name = label(code, getLanguage());
                return {code, name, search: normalize(code + ' ' + name)};
            });
            matches = [...searchableLanguages(getLanguage()), ...retained].filter(item => !query || item.search.includes(query));
            if (!query) matches.sort((a, b) => Number(selected.includes(b.code)) - Number(selected.includes(a.code)));
            else matches.sort((a, b) => Number(b.code === query) - Number(a.code === query));
            shown = 0; active = -1; search.removeAttribute('aria-activedescendant'); list.replaceChildren(); list.scrollTop = 0;
            appendResults();
            if (!matches.length) {
                const empty = document.createElement('p'); empty.className = 'language-picker-empty'; empty.textContent = t('profile_languages.no_results'); list.appendChild(empty);
            }
        }
        function toggle(code) {
            if (selected.includes(code)) selected = selected.filter(value => value !== code);
            else if (selected.length < 3) selected.push(code);
            else {status.textContent = t('profile_languages.limit'); return;}
            updateText();
            // Preserve the search and scroll position while selecting several languages.
            list.querySelectorAll('[role="option"]').forEach(button => {
                const optionCode = button.id.slice((root.id + '-option-').length), checked = selected.includes(optionCode);
                button.setAttribute('aria-selected', String(checked));
                button.setAttribute('aria-disabled', String(selected.length >= 3 && !checked));
                button.lastChild.textContent = checked ? '✓' : '';
            });
        }
        function open() {
            opened = true; panel.hidden = false; trigger.setAttribute('aria-expanded', 'true'); search.value = '';
            updateText(); renderResults(); place(); search.focus();
        }
        trigger.addEventListener('click', () => opened ? close() : open());
        trigger.addEventListener('keydown', event => {if (event.key === 'ArrowDown') {event.preventDefault(); if (!opened) open();}});
        search.addEventListener('input', renderResults);
        search.addEventListener('keydown', event => {
            if (event.key === 'Tab') {
                event.preventDefault(); close();
                const focusable = [...document.querySelectorAll('button, input, select, textarea, a[href], [tabindex="0"]')]
                    .filter(element => element.offsetParent !== null && !element.disabled && element.tabIndex >= 0);
                const next = event.shiftKey ? trigger : focusable[focusable.indexOf(trigger) + 1];
                (next || trigger).focus(); return;
            }
            if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); close(true); return;}
            if (event.key === 'Enter') {event.preventDefault(); if (active >= 0) toggle(matches[active].code); return;}
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || !matches.length) return;
            if (['Home', 'End'].includes(event.key) && !event.ctrlKey) return;
            event.preventDefault();
            active = event.key === 'Home' ? 0 : event.key === 'End' ? matches.length - 1 : Math.max(0, Math.min(matches.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1)));
            while (shown <= active) appendResults();
            const option = document.getElementById(root.id + '-option-' + matches[active].code);
            list.querySelector('.is-active')?.classList.remove('is-active'); option.classList.add('is-active');
            search.setAttribute('aria-activedescendant', option.id); option.scrollIntoView({block: 'nearest'});
        });
        list.addEventListener('scroll', () => {if (list.scrollHeight - list.scrollTop - list.clientHeight < 100) appendResults();});
        document.addEventListener('pointerdown', event => {if (opened && !root.contains(event.target) && !panel.contains(event.target)) close();});
        document.addEventListener('focusin', event => {if (opened && !root.contains(event.target) && !panel.contains(event.target)) close();});
        window.addEventListener('resize', () => {if (opened) place();});
        window.addEventListener('scroll', event => {if (opened && !panel.contains(event.target)) place();}, true);
        window.addEventListener('hashchange', () => close());
        return {getValue: () => [...selected], setValue: values => {selected = [...new Set(values)]; close(); updateText();}, close};
    }
    window.OperartisLanguagePicker = {mount, label};
})();
