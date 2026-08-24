/// <reference types="vite/client" />

interface Window {
  OperartisApi?: {
    apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
    broadcastDashboardDataChanged: (source?: string) => void;
    getDefaultApiBase: () => string;
    me: () => Promise<{ email: string; display_name?: string; role?: string }>;
  };
  getOperartisTheme?: () => 'light' | 'dark' | 'system';
  setOperartisTheme?: (theme: 'light' | 'dark' | 'system') => string;
}
