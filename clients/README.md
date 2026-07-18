# Clients — Hosted Microsites

This folder contains websites hosted by **Watu Lab** for clients who have not yet purchased their own domain.

## Structure

```
clients/
└── <client-slug>/       ← One folder per client
    ├── index.html       ← The client's main page
    ├── assets/          ← Client-specific images & media
    ├── css/
    │   └── styles.css   ← Client-specific styles
    └── js/
        └── scripts.js   ← Client-specific scripts
```

## Adding a New Client

1. Create a new folder inside `clients/` using the client's name in **lowercase-with-hyphens** (e.g., `clients/acme-bakery/`)
2. Add: `index.html`, `assets/`, `css/styles.css`, `js/scripts.js`
3. Update `sitemap.xml` at the root — add the new client URL (only if they want SEO; otherwise leave as noindex)
4. Make sure the client's `index.html` includes:
   - `<meta name="robots" content="noindex, follow">` (unless client wants Google indexing)
   - `<link rel="canonical" href="https://watulab.com/clients/<client-slug>/">`
   - "Web crafted by Watu Lab" credit in the footer with a link to `https://watulab.com`

## Naming Conventions

- Folder name: `lowercase-with-hyphens` only (no spaces, no capitals)
- Image filenames: `lowercase-with-hyphens.jpg` (no spaces, no special characters)
- All image alt text must be descriptive

## When a Client Gets Their Own Domain

1. The client's content moves to their own hosting
2. Delete the client's folder from `clients/` in one click
3. Remove their entry from `sitemap.xml`
4. Add a `301 redirect` from the old URL to their new domain (in their DNS/GitHub Pages config)
