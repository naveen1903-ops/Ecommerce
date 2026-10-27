# ShopEase — Experiment 11: Deploy Food Ordering Application

## Aim
Prepare the existing React food-ordering application for a production build and deploy it using GitHub Pages, Netlify, or Vercel.

## Procedures (a–f)

### a) Prepare a production build
- Use Vite's production build to generate optimized static files in `dist/`.
- Use `npm run build` and `npm run preview` to check the production output locally.

### b) Configure the project for deployment
- `vite.config.js` supports a configurable base path.
- `index.html`, `src/main.jsx`, `public/manifest.webmanifest`, and `public/sw.js` use base-aware paths for assets and service-worker registration.
- SPA rewrite/fallback configuration is included for each hosting provider.

### c) Deploy with GitHub Pages
- `.github/workflows/deploy.yml` builds and deploys `dist/` with GitHub Actions on pushes to `main` or a manual workflow run.
- `public/404.html` supports React Router deep links on GitHub Pages; the workflow fills in the repository base path.

### d) Deploy with Netlify
- `netlify.toml` sets `npm run build`, `dist`, SPA rewrites, and basic security headers.
- `public/_redirects` also provides the standard SPA fallback.

### e) Deploy with Vercel
- `vercel.json` sets the Vite build/output directory, SPA rewrite, and basic response security headers.

### f) Test the deployed application
- Follow `DEPLOYMENT.md` for instructions and a checklist that tests product/food routes, search, filters, cart, checkout, authentication, PWA assets, refreshes, and keyboard navigation.

## Run locally

```powershell
npm install
npm run dev
```

## Build and preview

```powershell
npm run build
npm run preview
```

## Tests from Experiments 9–10

```powershell
npm test -- --runInBand
```

## Files changed for Experiment 11

### Modified
- `package.json` — project name/version/description updated; build commands retained.
- `index.html` — manifest, icons, and application entry use Vite's base URL.
- `src/main.jsx` — base-aware BrowserRouter, GitHub Pages route restoration, and service-worker URL.
- `src/App.jsx` — home/footer experiment text updated.
- `public/manifest.webmanifest` — relative start URL, scope, icon paths, and shortcuts.
- `public/sw.js` — service-worker cache paths support the application base path.

### Newly added
- `vite.config.js`
- `.github/workflows/deploy.yml`
- `public/404.html`
- `public/.nojekyll` — prevents GitHub Pages/Jekyll processing from altering static output.
- `public/_redirects`
- `netlify.toml`
- `vercel.json`
- `DEPLOYMENT.md`

### Deleted
- None.

## Verification note
The deployment configuration was checked for valid JSON and consistent base-path references. A successful live deployment requires the user to push the repository to their own Git hosting account and select the deployment provider. Running an online deployment from this environment is not possible because it requires the user's hosting account.
