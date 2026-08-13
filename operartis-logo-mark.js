(function (global) {
    'use strict';

    if (!document.getElementById('operartis-logo-mark-css')) {
        var css = document.createElement('style');
        css.id = 'operartis-logo-mark-css';
        css.textContent = [
            '.operartis-logo-mark { display: inline-flex; line-height: 0; flex-shrink: 0; }',
            '.operartis-logo-mark svg { width: 100%; height: 100%; display: block; overflow: visible; }',
            '@keyframes olm-in1 {',
            '  0%   { stroke-dasharray:0.000 207.024; stroke-dashoffset:-207.024; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
            '  100% { stroke-dasharray:207.024 207.024; stroke-dashoffset:0.000; opacity:1; }',
            '}',
            '@keyframes olm-in2 {',
            '  0%   { stroke-dasharray:0.000 205.350; stroke-dashoffset:-205.350; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
            '  100% { stroke-dasharray:205.350 205.350; stroke-dashoffset:0.000; opacity:1; }',
            '}',
            '@keyframes olm-in3 {',
            '  0%   { stroke-dasharray:0.000 242.680; stroke-dashoffset:-242.680; opacity:1; animation-timing-function:cubic-bezier(0.455, 0.03, 0.515, 0.955); }',
            '  100% { stroke-dasharray:242.680 242.680; stroke-dashoffset:0.000; opacity:1; }',
            '}',
            '@keyframes olm-in4 {',
            '  0%      { opacity:0; }',
            '  81.92%  { opacity:0; }',
            '  100%    { opacity:1; animation-timing-function:cubic-bezier(0.55, 0.055, 0.675, 0.19); }',
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
            '.operartis-logo-mark .intro .p1 { animation: olm-in1 1.5s linear 1 forwards; }',
            '.operartis-logo-mark .intro .p2 { animation: olm-in2 1.5s linear 1 forwards; }',
            '.operartis-logo-mark .intro .p3 { animation: olm-in3 1.5s linear 1 forwards; }',
            '.operartis-logo-mark .intro .p4 { animation: olm-in4 1.5s linear 1 forwards; }',
            '.operartis-logo-mark .loop { opacity: 0; pointer-events: none; }',
            '.operartis-logo-mark:hover .intro,',
            '.header-brand:hover .operartis-logo-mark .intro { opacity: 0; }',
            '.operartis-logo-mark:hover .loop,',
            '.header-brand:hover .operartis-logo-mark .loop { opacity: 1; }',
            '.operartis-logo-mark:hover .loop .p1,',
            '.header-brand:hover .operartis-logo-mark .loop .p1 { animation: olm-draw1 3.840s linear infinite; animation-delay: -1.5s; }',
            '.operartis-logo-mark:hover .loop .p2,',
            '.header-brand:hover .operartis-logo-mark .loop .p2 { animation: olm-draw2 3.840s linear infinite; animation-delay: -1.5s; }',
            '.operartis-logo-mark:hover .loop .p3,',
            '.header-brand:hover .operartis-logo-mark .loop .p3 { animation: olm-draw3 3.840s linear infinite; animation-delay: -1.5s; }',
            '.operartis-logo-mark:hover .loop .p4,',
            '.header-brand:hover .operartis-logo-mark .loop .p4 { animation: olm-draw4 3.840s linear infinite; animation-delay: -1.5s; }',
            '@media (prefers-reduced-motion: reduce) {',
            '  .operartis-logo-mark .intro .p1,',
            '  .operartis-logo-mark .intro .p2,',
            '  .operartis-logo-mark .intro .p3 {',
            '    animation: none;',
            '    stroke-dashoffset: 0;',
            '    opacity: 1;',
            '  }',
            '  .operartis-logo-mark .intro .p1 { stroke-dasharray: 207.024 207.024; }',
            '  .operartis-logo-mark .intro .p2 { stroke-dasharray: 205.350 205.350; }',
            '  .operartis-logo-mark .intro .p3 { stroke-dasharray: 242.680 242.680; }',
            '  .operartis-logo-mark .intro .p4 { animation: none; opacity: 1; }',
            '  .operartis-logo-mark .loop { display: none !important; }',
            '  .operartis-logo-mark:hover .intro,',
            '  .header-brand:hover .operartis-logo-mark .intro { opacity: 1; }',
            '}'
        ].join('\n');
        document.head.appendChild(css);
    }

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
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#' + uid + 'cut1)"/>',
            '    <path class="p2" d="M18.825 110.861A71.254 71.254 0 0 1 151.978 63.548" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" clip-path="url(#' + uid + 'cut2)"/>',
            '    <path class="p3" d="M177.150 39.450L105.150 110.988 73.200 79.038 5.319 146.919" fill="none" stroke="url(#' + uid + 'g)"',
            '          stroke-width="15.045" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.5"/>',
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
        var className = 'operartis-logo-mark' + (props && props.className ? ' ' + props.className : '');
        return React.createElement('span', {
            className: className,
            role: 'img',
            'aria-label': 'Operartis',
            dangerouslySetInnerHTML: { __html: htmlRef.current }
        });
    });
})(window);
