# Midlands Ambulance Group website

The new www.midlandsambulance.co.uk: a static site hosted on Wix (Wix Headless).

- `site/` is the finished website, one `.html` file per page (for example `site/training/basic-first-aid-cpr.html`). Wix Headless only serves files at their exact path and does not open a folder's `index.html`, so pages are not built as folders. This folder is what gets uploaded to Wix.
- Every page carries its styles inline (`site/assets/site.css` is the same CSS for reference) and loads `site/assets/site.js` for the page behaviour (form thank-you redirect, medical cover guide). Fonts are self-hosted in `site/fonts/` (copied from `tools/fonts/`, SIL Open Font Licence).
- `site/img/` holds the web images: `name.webp` (up to 1400px) and `name-800.webp` for phones, plus `hero.jpg` for link previews. The prerender turns each photo panel into a lazy-loaded `<img>` with both sizes; the first one on a page loads with high priority.
- `tools/photos/` holds the JPEG masters. After adding or changing a photo there, run `tools/images.sh` to rebuild the WebP files, then the prerender.
- `tools/preview/index.html` is the single-page preview the site was built from. `tools/prerender.mjs` turns it into the pages in `site/`:

  ```bash
  node tools/prerender.mjs "$PWD/tools/preview" "$PWD/site" noindex   # staging: hidden from Google
  node tools/prerender.mjs "$PWD/tools/preview" "$PWD/site"           # live
  ```
  It needs Playwright with Chromium, and `tools/preview/img` pointing at `site/img`.

## Before going live

- Replace the text highlighted in yellow (`class="tbc"`): prices, course lengths, dates, bios, company number.
- The hero "quick quote" boxes send visitors to the quote page with their answers in the address (`?type=&date=&size=&pc=`), which are filled into Cognito form 15. Check this on the live site.
- Rebuild without `noindex`, then point the domain at the Wix Headless site and add the 301 redirects from the site plan.

Rules for content: never call courses "accredited"; no CQC registration claims or patient conveyance until CQC registration is granted; no FREC pages until delivered through an approved centre; no star rating until real Google reviews exist.
