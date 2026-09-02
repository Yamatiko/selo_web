# Academic personal site

A small, fast personal website for an academic — Home, CV, Research (Work in
Progress / Working Papers / Publications), Hobbies, Contact — with a browser-based
admin for editing every section.

**Stack:** [Astro](https://astro.build) (static output) · [Keystatic](https://keystatic.com)
CMS · [Markdoc](https://markdoc.dev) for rich text · deployed to Netlify.

---

## Local development

```bash
npm install
npm run dev
```

- Site: <http://localhost:4321>
- Admin: <http://localhost:4321/keystatic> (local mode — edits write straight to
  the `content/` folder on disk)

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` | Boundary check + production build (`dist/`) |
| `npm run preview` | Serve the built site locally |
| `npm run check` | `astro check` — type-check `.astro`/`.ts` |
| `npm run check:boundaries` | Enforce the layer rules (also runs in `build`) |

---

## Architecture

Three layers, one-way dependencies. The point is that the CMS choice never leaks
into the pages.

```
cms/                      Layer 1 — CMS schema (isolated)
  keystatic.config.ts       assembles the schema
  collections/*.ts          one file per collection / singleton
  fields/shared.ts          reusable field fragments
  → imports only @keystatic/core. Never imports src/.

content/                  Data written by the CMS (Markdown/YAML). Not code.
public/media/             Uploaded images & PDFs.

src/lib/content/          Layer 2 — content API (anti-corruption layer)
  reader.ts                 the ONLY file that imports @keystatic/* + keystatic.config
  markdoc.ts                Markdoc node → HTML string
  types.ts                  domain types, independent of Keystatic
  index.ts                  getHome(), getCV(), getResearchSections(), … + sorting

src/config/site.ts        Build-time constants (site URL, …)

src/layouts/ src/components/ src/pages/   Layer 3 — presentation
  → import only from `../lib/content` and each other.
  → @keystatic and cms/ are FORBIDDEN here (enforced by scripts/check-boundaries.mjs).

src/styles/global.css     All visual tokens (colour, type, spacing). Themes only
                          re-map these variables; components read them.
```

`root keystatic.config.ts` is a one-line re-export of `cms/keystatic.config.ts` —
Keystatic's tooling requires the file to sit at the project root.

### Changing the look

Everything visual is a CSS custom property in `src/styles/global.css` (`:root`).
Light/dark themes and the per-site accent colour only override those variables.
Per-component tweaks live in that component's scoped `<style>` block — changing
one never affects another.

### Adding a new top-level section (repeatable pattern)

1. **Schema** — add `cms/collections/<name>.ts`, register it in
   `cms/keystatic.config.ts` (`collections` / `singletons` + `ui.navigation`).
2. **Content API** — add a type in `src/lib/content/types.ts` and a `get<Name>()`
   in `src/lib/content/index.ts` that maps the raw entry to that type.
3. **Page** — add `src/pages/<name>.astro`, fetch via `get<Name>()`, render with
   existing components (`Prose`, `PaperList`, …) where possible.
4. **Nav** — add the link in the admin under **Settings → Site → Navigation**.

---

## Deployment (Netlify)

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git**. Build settings come from
   `netlify.toml` (build `npm run build`, publish `dist`).
3. Set environment variables (**Site configuration → Environment variables**):

   | Variable | Value |
   | --- | --- |
   | `SITE_URL` | `https://your-domain.tld` (used for canonical URLs + sitemap) |
   | `PUBLIC_KEYSTATIC_GITHUB_REPO` | `your-github-user/your-repo` |

4. First deploy will succeed but the admin is still in local mode. Turn on
   GitHub mode:
   - Visit `https://your-site/keystatic` and follow the setup flow — it creates a
     GitHub App and shows you the values for:
     `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
     `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
   - Add all four to Netlify env vars (alongside `PUBLIC_KEYSTATIC_GITHUB_REPO`)
     and redeploy.
5. From then on, edits made at `/keystatic` are committed to GitHub and Netlify
   rebuilds automatically.

### Contact form

The form on `/contact` uses **Netlify Forms** — no backend. Submissions appear
under **Forms** in the Netlify dashboard; add a notification email there. Toggle
the form on/off in the admin (**Contact → Show a contact form**).

To use a different host (Cloudflare Pages, Vercel), swap the adapter in
`astro.config.mjs` and replace the Netlify form with a service like Web3Forms.

---

## First things to edit

- **Settings → Site**: title, tagline, navigation, accent colours, footer.
- **Page · Home / CV / Contact**: your details. Replace the placeholder
  `content/**` entries.
- `public/favicon.svg`: swap the placeholder monogram.
