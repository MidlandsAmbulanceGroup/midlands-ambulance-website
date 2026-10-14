# Midlands Ambulance Group website

The new www.midlandsambulance.co.uk: a static site hosted on Wix (Wix Headless).

- `site/` is the finished website, one `.html` file per page (for example `site/training/basic-first-aid-cpr.html`). Wix Headless only serves files at their exact path and does not open a folder's `index.html`, so pages are not built as folders. This folder is what gets uploaded to Wix.
- `site/assets/site.css` holds every style; `site/img/` holds the photos and logos.
- `tools/preview/index.html` is the single-page preview the site was built from. `tools/prerender.mjs` turns it into the pages in `site/`:

  ```bash
  node tools/prerender.mjs "$PWD/tools/preview" "$PWD/site" noindex   # staging: hidden from Google
  node tools/prerender.mjs "$PWD/tools/preview" "$PWD/site"           # live
  ```
  It needs Playwright with Chromium, and `tools/preview/img` pointing at `site/img`.

## Before going live

- Replace the text highlighted in yellow (`class="tbc"`): prices, course lengths, dates, bios, company number.
- Connect the quote and training forms to the Cognito forms (they currently go straight to the thank-you pages).
- Rebuild without `noindex`, then point the domain at the Wix Headless site and add the 301 redirects from the site plan.

Rules for content: never call courses "accredited"; no CQC registration claims or patient conveyance until CQC registration is granted; no FREC pages until delivered through an approved centre; no star rating until real Google reviews exist.
