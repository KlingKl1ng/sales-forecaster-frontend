# Coolify Frontend Deployment

## Application

- Type: Static site
- Base directory: `frontend`
- Build command: leave empty
- Output directory: leave empty / root
- Production domains: `https://operartis.io`, `https://www.operartis.io`
- Staging domain: `https://staging.operartis.io`

## DNS

Create DNS records pointing to the Hetzner CPX32 public IP:

- `A @`
- `A www`
- `A api`
- Optional: `A staging`

Use `AAAA` records only if IPv6 is configured on the server.

## Backend

Set the backend Coolify domain to:

- `https://api.operartis.io`

Set the backend environment variable if you want to override the default CORS list:

```text
ALLOWED_ORIGINS=https://operartis.io,https://www.operartis.io,https://staging.operartis.io
```

Recommended backend abuse-protection variables:

```text
MAX_REQUEST_BYTES=26214400
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_REQUESTS=120
HEAVY_RATE_LIMIT_REQUESTS=30
```

The backend defaults now allow only the three Operartis HTTPS origins. Add local origins to `ALLOWED_ORIGINS` only while actively testing from your Mac.

## Security Headers

For the frontend Coolify Static app, paste the directives from `coolify-nginx-security.conf` into the Coolify custom Nginx configuration/server context.

The current CSP is intentionally temporary/relaxed because the static frontend still uses inline scripts and runtime Babel. After the future React/Vite rebuild, remove `'unsafe-inline'` and `'unsafe-eval'`.

## Root Page

`index.html` is the single source for the Operartis terminal / landing experience at `/`.

`terminal.html` is a lightweight redirect to `/` so old bookmarks to `/terminal.html` keep working without maintaining a second copy of the app.

Optional server redirect (preferred over the HTML stub if your reverse proxy supports it):

```nginx
location = /terminal.html {
    return 301 /;
}
```

## Cutover Checklist

- Confirm `https://api.operartis.io/` returns the backend health response.
- Confirm `https://operartis.io/` opens the Operartis terminal.
- Confirm `forecaster.html`, `mlforecaster.html`, and `inventory.html` call `https://api.operartis.io`.
- Keep Vercel online for 7 days as rollback, then remove or disable it.
