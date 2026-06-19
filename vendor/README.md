# Frontend Vendor Files

These browser bundles are vendored so production pages do not execute JavaScript directly from third-party CDNs.

- `tailwindcss-3.4.17.js` from `https://cdn.tailwindcss.com/3.4.17`
- `react-17.0.2.production.min.js` from `https://unpkg.com/react@17.0.2/umd/react.production.min.js`
- `react-dom-17.0.2.production.min.js` from `https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js`
- `babel-standalone-7.26.10.min.js` retained from the existing app
- `prop-types-15.8.1.min.js` from cdnjs
- `recharts-1.8.5.min.js` and `recharts-2.1.12.min.js` from cdnjs
- `xlsx-0.18.5.full.min.js` from cdnjs
- `lodash-4.17.21.min.js` from cdnjs
- `xlsx-js-style-1.2.0.bundle.min.js` from jsDelivr
- `exceljs-4.4.0.min.js` from jsDelivr
- `lucide-current.min.js` captured from the current Lucide UMD bundle

The later React/Vite rebuild should replace these static browser bundles with normal package-managed dependencies.
