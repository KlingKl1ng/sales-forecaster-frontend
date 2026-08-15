(function (global) {
    'use strict';

    var cssEl = document.getElementById('operartis-logo-mark-css');
    if (!cssEl) {
        cssEl = document.createElement('style');
        cssEl.id = 'operartis-logo-mark-css';
        document.head.appendChild(cssEl);
    }
    cssEl.textContent = [
        '.operartis-logo-mark { display: inline-flex; line-height: 0; flex-shrink: 0; }',
        '.operartis-logo-mark svg { width: 100%; height: 100%; display: block; overflow: visible; }',
        '@keyframes olm-in1 {',
        '  0%      { stroke-dasharray:207.024 207.024; stroke-dashoffset:0.000; opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  33.333% { stroke-dasharray:0.000 207.024; stroke-dashoffset:0.000; opacity:1; }',
        '  33.400% { stroke-dasharray:0.000 207.024; stroke-dashoffset:-207.024; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
        '  100%    { stroke-dasharray:207.024 207.024; stroke-dashoffset:0.000; opacity:1; }',
        '}',
        '@keyframes olm-in2 {',
        '  0%      { stroke-dasharray:205.350 205.350; stroke-dashoffset:0.000; opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  33.333% { stroke-dasharray:0.000 205.350; stroke-dashoffset:0.000; opacity:1; }',
        '  33.400% { stroke-dasharray:0.000 205.350; stroke-dashoffset:-205.350; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
        '  100%    { stroke-dasharray:205.350 205.350; stroke-dashoffset:0.000; opacity:1; }',
        '}',
        '@keyframes olm-in3 {',
        '  0%      { stroke-dasharray:242.680 242.680; stroke-dashoffset:0.000; opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  33.333% { stroke-dasharray:0.000 242.680; stroke-dashoffset:0.000; opacity:1; }',
        '  33.400% { stroke-dasharray:0.000 242.680; stroke-dashoffset:-242.680; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
        '  100%    { stroke-dasharray:242.680 242.680; stroke-dashoffset:0.000; opacity:1; }',
        '}',
        '@keyframes olm-in4 {',
        '  0%      { opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  28%     { opacity:1; }',
        '  33.333% { opacity:0; }',
        '  88%     { opacity:0; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  100%    { opacity:1; }',
        '}',
        '@keyframes olm-draw1 {',
        '  0%          { stroke-dasharray:0.000 207.024; stroke-dashoffset:-207.024; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
        '  39.0625%    { stroke-dasharray:207.024 207.024; stroke-dashoffset:0.000; opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  78.1250%    { stroke-dasharray:0.000 207.024; stroke-dashoffset:0.000; opacity:1; }',
        '  78.2250%    { opacity:0; }',
        '  100%        { stroke-dasharray:0.000 207.024; stroke-dashoffset:0.000; opacity:0; }',
        '}',
        '@keyframes olm-draw2 {',
        '  0%          { stroke-dasharray:0.000 205.350; stroke-dashoffset:-205.350; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
        '  39.0625%    { stroke-dasharray:205.350 205.350; stroke-dashoffset:0.000; opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  78.1250%    { stroke-dasharray:0.000 205.350; stroke-dashoffset:0.000; opacity:1; }',
        '  78.2250%    { opacity:0; }',
        '  100%        { stroke-dasharray:0.000 205.350; stroke-dashoffset:0.000; opacity:0; }',
        '}',
        '@keyframes olm-draw3 {',
        '  0%          { stroke-dasharray:0.000 242.680; stroke-dashoffset:-242.680; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
        '  39.0625%    { stroke-dasharray:242.680 242.680; stroke-dashoffset:0.000; opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  78.1250%    { stroke-dasharray:0.000 242.680; stroke-dashoffset:0.000; opacity:1; }',
        '  78.2250%    { opacity:0; }',
        '  100%        { stroke-dasharray:0.000 242.680; stroke-dashoffset:0.000; opacity:0; }',
        '}',
        '@keyframes olm-draw4 {',
        '  0%          { opacity:0; }',
        '  32.0000%    { opacity:0; }',
        '  39.0625%    { opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
        '  78.1250%    { opacity:1; }',
        '  78.2250%    { opacity:0; }',
        '  100%        { opacity:0; }',
        '}',
        '.operartis-logo-mark .loop { opacity: 0; pointer-events: none; }',
        '.operartis-logo-mark .intro .p1,',
        '.operartis-logo-mark .intro .p2,',
        '.operartis-logo-mark .intro .p3 {',
        '  animation: none !important;',
        '  stroke-dashoffset: 0;',
        '  opacity: 1;',
        '}',
        '.operartis-logo-mark .intro .p1 { stroke-dasharray: 207.024 207.024; }',
        '.operartis-logo-mark .intro .p2 { stroke-dasharray: 205.350 205.350; }',
        '.operartis-logo-mark .intro .p3 { stroke-dasharray: 242.680 242.680; }',
        '.operartis-logo-mark .intro .p4 { animation: none !important; opacity: 1; }',
        '.operartis-logo-mark.is-intro .intro .p1 { animation: olm-in1 2.25s linear 1 forwards !important; }',
        '.operartis-logo-mark.is-intro .intro .p2 { animation: olm-in2 2.25s linear 1 forwards !important; }',
        '.operartis-logo-mark.is-intro .intro .p3 { animation: olm-in3 2.25s linear 1 forwards !important; }',
        '.operartis-logo-mark.is-intro .intro .p4 { animation: olm-in4 2.25s linear 1 forwards !important; }',
        '.operartis-logo-mark.is-looping .intro { opacity: 0; }',
        '.operartis-logo-mark.is-looping .loop { opacity: 1; }',
        '.operartis-logo-mark.is-looping .loop .p1 { animation: olm-draw1 3.840s linear infinite; animation-delay: -1.5s; }',
        '.operartis-logo-mark.is-looping .loop .p2 { animation: olm-draw2 3.840s linear infinite; animation-delay: -1.5s; }',
        '.operartis-logo-mark.is-looping .loop .p3 { animation: olm-draw3 3.840s linear infinite; animation-delay: -1.5s; }',
        '.operartis-logo-mark.is-looping .loop .p4 { animation: olm-draw4 3.840s linear infinite; animation-delay: -1.5s; }',
        '@media (prefers-reduced-motion: reduce) {',
        '  .operartis-logo-mark .intro .p1,',
        '  .operartis-logo-mark .intro .p2,',
        '  .operartis-logo-mark .intro .p3,',
        '  .operartis-logo-mark.is-intro .intro .p1,',
        '  .operartis-logo-mark.is-intro .intro .p2,',
        '  .operartis-logo-mark.is-intro .intro .p3 {',
        '    animation: none !important;',
        '    stroke-dashoffset: 0;',
        '    opacity: 1;',
        '  }',
        '  .operartis-logo-mark .intro .p1,',
        '  .operartis-logo-mark.is-intro .intro .p1 { stroke-dasharray: 207.024 207.024; }',
        '  .operartis-logo-mark .intro .p2,',
        '  .operartis-logo-mark.is-intro .intro .p2 { stroke-dasharray: 205.350 205.350; }',
        '  .operartis-logo-mark .intro .p3,',
        '  .operartis-logo-mark.is-intro .intro .p3 { stroke-dasharray: 242.680 242.680; }',
        '  .operartis-logo-mark .intro .p4,',
        '  .operartis-logo-mark.is-intro .intro .p4 { animation: none !important; opacity: 1; }',
        '  .operartis-logo-mark .loop,',
        '  .operartis-logo-mark.is-looping .loop { display: none !important; }',
        '  .operartis-logo-mark.is-looping .intro { opacity: 1; }',
        '}'
    ].join('\n');

    function markSvg(uid) {
        return [
            '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"',
            '     style="transform:rotate(0deg);transform-origin:50% 50%;background:transparent;">',
            '  <title>Operartis</title>',
            '  <defs>',
            '    <linearGradient id="' + uid + 'g" x1="12%" y1="88%" x2="92%" y2="12%">',
            '      <stop offset="0%" stop-color="#f78812"/>',
            '      <stop offset="55%" stop-color="#f5ab16"/>',
            '      <stop offset="100%" stop-color="#f4db1b"/>',
            '    </linearGradient>',
            '    <clipPath id="' + uid + 'cut1" clipPathUnits="userSpaceOnUse">',
            '      <path d="M166.337,79.394A79.576,79.576 0 0 1 16.369,129.527L31.455,122.493A62.932,62.932 0 0 0 151.402,94.329Z"/>',
            '    </clipPath>',
            '    <clipPath id="' + uid + 'cut2" clipPathUnits="userSpaceOnUse">',
            '      <path d="M10.408,111.249A79.576,79.576 0 0 1 160.315,61.638L145.291,68.804A62.932,62.932 0 0 0 25.559,96.098Z"/>',
            '    </clipPath>',
            '  </defs>',
            '  <rect width="192" height="192" fill="none" pointer-events="all"/>',
            '  <g class="intro">',
            '    <path class="p1" d="M157.926 79.906A71.254 71.254 0 0 1 24.722 127.690" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#' + uid + 'cut1)"',
            '          stroke-dasharray="207.024 207.024" stroke-dashoffset="0"/>',
            '    <path class="p2" d="M18.825 110.861A71.254 71.254 0 0 1 151.978 63.548" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#' + uid + 'cut2)"',
            '          stroke-dasharray="205.350 205.350" stroke-dashoffset="0"/>',
            '    <path class="p3" d="M177.150 39.450L105.150 110.988 73.200 79.038 5.319 146.919" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.5"',
            '          stroke-dasharray="242.680 242.680" stroke-dashoffset="0"/>',
            '    <path class="p4" d="M191.850 24.750L162.450 24.750 191.850 54.150Z" fill="url(#' + uid + 'g)" stroke="none"/>',
            '  </g>',
            '  <g class="loop">',
            '    <path class="p1" d="M157.926 79.906A71.254 71.254 0 0 1 24.722 127.690" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#' + uid + 'cut1)"/>',
            '    <path class="p2" d="M18.825 110.861A71.254 71.254 0 0 1 151.978 63.548" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#' + uid + 'cut2)"/>',
            '    <path class="p3" d="M177.150 39.450L105.150 110.988 73.200 79.038 5.319 146.919" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.5"/>',
            '    <path class="p4" d="M191.850 24.750L162.450 24.750 191.850 54.150Z" fill="url(#' + uid + 'g)" stroke="none"/>',
            '  </g>',
            '</svg>'
        ].join('\n');
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    var SCROLL_KEYS = {
        ArrowDown: 1,
        ArrowUp: 1,
        PageDown: 1,
        PageUp: 1,
        Home: 1,
        End: 1,
        ' ': 1
    };

    global.OperartisLogoMark = React.memo(function OperartisLogoMark(props) {
        var idRef = React.useRef(null);
        if (idRef.current == null) {
            global.__operartisLogoSeq = (global.__operartisLogoSeq || 0) + 1;
            idRef.current = 'olm' + global.__operartisLogoSeq;
        }
        var htmlRef = React.useRef(null);
        if (htmlRef.current == null) {
            htmlRef.current = markSvg(idRef.current);
        }
        var nodeRef = React.useRef(null);
        var playedRef = React.useRef(false);
        var hoverArmedRef = React.useRef(false);
        var loopState = React.useState(false);
        var isLooping = loopState[0];
        var setLooping = loopState[1];

        React.useEffect(function () {
            if (prefersReducedMotion()) return undefined;

            var brand = null;
            var readyTimer = 0;
            var introReady = false;

            function playIntro() {
                if (playedRef.current) return;
                playedRef.current = true;
                var node = nodeRef.current;
                if (node) node.classList.add('is-intro');
                window.removeEventListener('wheel', onWheel, true);
                window.removeEventListener('keydown', onKeyDown, true);
            }

            function onWheel(e) {
                if (!introReady || !e.isTrusted || playedRef.current) return;
                if (Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return;
                playIntro();
            }

            function onKeyDown(e) {
                if (!introReady || !e.isTrusted || playedRef.current) return;
                if (!SCROLL_KEYS[e.key]) return;
                playIntro();
            }

            function setLoop(on) {
                if (!hoverArmedRef.current) return;
                setLooping(!!on);
            }

            function onPointerMove(e) {
                if (!e.isTrusted) return;
                hoverArmedRef.current = true;
                window.removeEventListener('pointermove', onPointerMove, true);
                var node = nodeRef.current;
                if (node && (node === e.target || node.contains(e.target) || (brand && brand.contains(e.target)))) {
                    setLoop(true);
                }
            }

            function onPointerEnter() {
                setLoop(true);
            }

            function onPointerLeave() {
                setLooping(false);
            }

            function bindHover() {
                var node = nodeRef.current;
                brand = node && node.closest ? node.closest('.header-brand') : null;
                var hoverRoot = brand || node;
                if (hoverRoot) {
                    hoverRoot.addEventListener('pointerenter', onPointerEnter);
                    hoverRoot.addEventListener('pointerleave', onPointerLeave);
                }
            }

            bindHover();
            window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
            window.addEventListener('wheel', onWheel, { capture: true, passive: true });
            window.addEventListener('keydown', onKeyDown, true);
            readyTimer = window.setTimeout(function () {
                introReady = true;
            }, 500);

            return function () {
                window.clearTimeout(readyTimer);
                window.removeEventListener('pointermove', onPointerMove, true);
                window.removeEventListener('wheel', onWheel, true);
                window.removeEventListener('keydown', onKeyDown, true);
                var node = nodeRef.current;
                var hoverRoot = brand || node;
                if (hoverRoot) {
                    hoverRoot.removeEventListener('pointerenter', onPointerEnter);
                    hoverRoot.removeEventListener('pointerleave', onPointerLeave);
                }
            };
        }, []);

        var className = 'operartis-logo-mark'
            + (playedRef.current ? ' is-intro' : '')
            + (isLooping ? ' is-looping' : '')
            + (props && props.className ? ' ' + props.className : '');
        return React.createElement('span', {
            ref: nodeRef,
            className: className,
            role: 'img',
            'aria-label': 'Operartis',
            dangerouslySetInnerHTML: { __html: htmlRef.current }
        });
    });
})(window);
