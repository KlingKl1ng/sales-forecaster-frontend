window.tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    gold: '#f59e0b',
                    dark: '#b45309',
                    gray: '#f8fafc',
                    border: '#e2e8f0'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace']
            },
            fontSize: {
                xxs: '0.65rem'
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                }
            }
        }
    }
};
