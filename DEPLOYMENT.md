# ShopEase Experiment 11 — Deployment Guide

## Aim
Prepare the ShopEase React food-ordering demo for production and deploy it with GitHub Pages, Netlify, or Vercel.

## 1. Production build

```powershell
npm install
npm run build
npm run preview
```

Vite writes production files into `dist/`. Open the preview URL and test the food demo, product routes, login, cart, checkout validation, and order routes. This build is static; no private API keys should be added to client-side code.

## 2. GitHub Pages (automated)

1. Create a GitHub repository and push this project to the `main` branch.
2. On GitHub, open **Settings → Pages** and set the source to **GitHub Actions**.
3. Push to `main` or manually run **Actions → Deploy ShopEase to GitHub Pages → Run workflow**.
4. Wait for the workflow to finish successfully, then open the URL shown in the `github-pages` deployment environment.
5. The workflow computes the correct Vite base path for a repository site and configures `public/404.html` for client-side routes. For a custom domain or `username.github.io` repository, the base path is `/`.

For a project site, the URL normally has this shape: `https://USERNAME.github.io/REPOSITORY/`.

## 3. Netlify

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Use build command `npm run build` and publish directory `dist`; `netlify.toml` already declares these settings.
4. Deploy and open the URL supplied by Netlify.
5. Test a nested path directly (for example `/food-demo`) and refresh it. The SPA rewrite should return `index.html`.

Optional CLI deployment:

```powershell
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 4. Vercel

1. Push the project to a Git repository.
2. In Vercel, choose **Add New → Project**, import the repository, and deploy.
3. Verify the build command is `npm run build` and output directory is `dist`; `vercel.json` declares both and includes the SPA rewrite.
4. Open the deployed URL and test the home, food-demo, food-detail, product, cart, and checkout routes.

Optional CLI deployment:

```powershell
npm install -g vercel
vercel login
vercel
vercel --prod
```

## 5. Deployment verification checklist

- [ ] Production build completes without errors.
- [ ] Home page and CSS/images load without 404 errors.
- [ ] Food menu, food details, search, category filter, and cart actions work.
- [ ] Refreshing a nested route does not show the host's 404 page.
- [ ] Login and protected routes behave as expected; test accounts/API services are reachable.
- [ ] Checkout validation works; use demo data only and never enter real payment details.
- [ ] Browser developer tools show the manifest and service worker under the deployed origin.
- [ ] The site still loads its cached app shell after a successful first visit when offline (API-backed content may not work offline).
- [ ] Keyboard navigation, labels, and responsive layouts work on the deployed site.

## Notes

- The app is a frontend coursework demonstration. Fake Store API or other third-party APIs may change or be unavailable, and demo order persistence is not a real backend.
- Never commit credentials, private keys, or production secrets to frontend environment variables. Values prefixed with `VITE_` are bundled into client-accessible code.
- Deploy using one host at a time, or use the same repository to create separate deployments on all three hosts.
