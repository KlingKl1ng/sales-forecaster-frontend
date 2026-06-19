(function () {
    var LOCAL_HOSTS = { localhost: 1, '127.0.0.1': 1, '::1': 1 };
    var isLocal = LOCAL_HOSTS[window.location.hostname] || window.location.protocol === 'file:';
    var maxUploadBytes = 20 * 1024 * 1024;
    var maxWorkbookSheets = 10;
    var maxSheetRows = 50000;

    if (!isLocal && window.console) {
        ['debug', 'error', 'info', 'log', 'warn'].forEach(function (level) {
            if (typeof window.console[level] === 'function') {
                window.console[level] = function () { };
            }
        });
    }

    function extensionOf(file) {
        var name = file && file.name ? file.name : '';
        var index = name.lastIndexOf('.');
        return index >= 0 ? name.slice(index).toLowerCase() : '';
    }

    function validateUploadFile(file, options) {
        options = options || {};
        if (!file) return;

        var allowedExtensions = options.allowedExtensions || ['.xlsx', '.xls', '.csv'];
        var maxBytes = options.maxBytes || maxUploadBytes;
        var ext = extensionOf(file);

        if (allowedExtensions.indexOf(ext) === -1) {
            throw new Error('Unsupported file type. Please upload: ' + allowedExtensions.join(', '));
        }

        if (file.size > maxBytes) {
            throw new Error('File is too large. Maximum upload size is ' + Math.floor(maxBytes / 1024 / 1024) + ' MB.');
        }
    }

    function validateWorkbook(workbook, options) {
        options = options || {};
        if (!workbook || !Array.isArray(workbook.SheetNames)) return;

        var maxSheets = options.maxSheets || maxWorkbookSheets;
        var maxRows = options.maxRows || maxSheetRows;

        if (workbook.SheetNames.length > maxSheets) {
            throw new Error('Workbook has too many sheets. Maximum allowed is ' + maxSheets + '.');
        }

        if (!window.XLSX || !window.XLSX.utils || typeof window.XLSX.utils.decode_range !== 'function') return;

        workbook.SheetNames.forEach(function (sheetName) {
            var sheet = workbook.Sheets[sheetName];
            if (!sheet || !sheet['!ref']) return;
            var range = window.XLSX.utils.decode_range(sheet['!ref']);
            var rowCount = range.e.r - range.s.r + 1;
            if (rowCount > maxRows) {
                throw new Error('Sheet "' + sheetName + '" has too many rows. Maximum allowed is ' + maxRows + '.');
            }
        });
    }

    function escapeSpreadsheetFormula(value) {
        if (typeof value !== 'string') return value;
        return /^[=+\-@]/.test(value) ? "'" + value : value;
    }

    function sanitizeForSpreadsheet(value) {
        if (Array.isArray(value)) return value.map(sanitizeForSpreadsheet);
        if (value && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]') {
            var sanitized = {};
            Object.keys(value).forEach(function (key) {
                sanitized[key] = sanitizeForSpreadsheet(value[key]);
            });
            return sanitized;
        }
        return escapeSpreadsheetFormula(value);
    }

    function safeFilename(filename, fallback) {
        var value = String(filename || fallback || 'operartis-export.xlsx');
        return value.replace(/[\\/:*?"<>|]/g, '_').replace(/[\r\n]/g, '').slice(0, 180);
    }

    function downloadBlob(blob, filename) {
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = safeFilename(filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    window.OperartisSecurity = {
        maxUploadBytes: maxUploadBytes,
        maxWorkbookSheets: maxWorkbookSheets,
        maxSheetRows: maxSheetRows,
        validateUploadFile: validateUploadFile,
        validateWorkbook: validateWorkbook,
        escapeSpreadsheetFormula: escapeSpreadsheetFormula,
        sanitizeForSpreadsheet: sanitizeForSpreadsheet,
        safeFilename: safeFilename,
        downloadBlob: downloadBlob
    };
})();
