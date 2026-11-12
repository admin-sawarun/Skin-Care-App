# Lock and Key Skin Care website

React + Vite. The marketing pages, plus the Privacy, Terms and Refund pages.

- `npm install` then `npm run dev`: dev server on http://localhost:5173
- `npm run build`: builds into `../backend/public/web`, which the backend serves at the same URL as the API. Commit that folder after building, because Railway does not build the website.

Where things are:
- Pages: `src/pages/`
- Header and footer: `src/components/Layout.jsx`
- Styles: `src/styles.css`
- Images: `public/site/`
- Policy text: `src/legal/*.html`

When adding a page, add its route in `src/App.jsx` and in `WEBSITE_ROUTES` in `backend/src/app.js`.

`/account-deletion` is not part of this site. It is a separate page in `backend/public/account-deletion.html`, with a Firebase sign-in and delete form.
