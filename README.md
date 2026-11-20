# CHARGE-ON CONSTRUCTION — Website V1

A fully responsive **editorial architectural website preview**, independently designed and built for Charge-On Construction LLC. Design direction is informed by walkerwarner.com; no Walker Warner code, photography, logos or copied editorial content is included.

## Status

- **Development preview, not production release.** All conceptual architectural visuals are newly generated *illustrative imagery*, **not** examples of completed Charge-On work.
- Company services and contact email have been verified against the existing Google Sites website.
- The site ships with an editable project template, but no invented completed projects.
- The estimate form is prepared for Netlify Forms; the existing Netlify project currently has form detection disabled. Enable detection and redeploy to collect submissions. Configure an eligible notification recipient separately and test the full flow. Until then, the direct email link remains usable.
- Preview pages carry `noindex, nofollow` to avoid publishing illustrative content as a real portfolio. Remove this only after real photos and content have been approved.
- No existing Google Sites content or Netlify production deployment was modified.

## Pages

- `/` — editorial homepage
- `/projects/` — architectural image studies + project list placeholder
- `/projects/template/` — unpublished editable project template (example only)
- `/approach/` — construction philosophy
- `/about/` — company information
- `/services/` — verified construction capabilities
- `/estimate/` — prepared Netlify estimate form
- `/thank-you/` — submission success destination

## Edit content

Edit `src/content.json` then run `npm run build` (or `node scripts/build.mjs`). All generated HTML is written to `site/`.

- **Images:** replace files in `site/assets/images/` with approved Charge-On photography, or change image names in `src/content.json`.
- **Text:** edit company details and services in `src/content.json`; page-specific headlines and composition are in `scripts/build.mjs`.
- **Design:** edit `site/assets/css/style.css`.
- **Navigation:** edit `scripts/build.mjs`.
- **Form:** edit `scripts/build.mjs`, regenerate the site, enable Netlify Forms and test.

## Local preview

```
node scripts/build.mjs
python3 -m http.server 8000 --directory site
```

Open http://localhost:8000/.

## Deployment

Suggested repository: `lemaiora/charge-on-construction` (not created by this package).

Existing Netlify site name: `charge-on-construction` (already exists; preserve production).

Netlify configuration in `netlify.toml`: build command `node scripts/build.mjs`; publish directory `site`.

Create a **new GitHub repository** with the name above and push these files, then connect a **draft/preview** deploy in Netlify. Do not merge or publish to production until approved.

## Image provenance

Generated architectural illustrations were produced for layout development and cropped into nine independent images. These do **not** depict Charge-On Construction's actual portfolio. The website labels them accordingly. No Walker Warner imagery was copied.

## Pre-launch requirements

1. Replace concept images with verified Charge-On project photography, where available.
2. Supply verified project titles/scopes to create real project pages.
3. Confirm the legal business details, phone number if desired, and any additional service areas.
4. Configure & test Netlify Forms; enable notifications or other delivery method.
5. Remove `noindex` after review, then add production sitemap and canonical metadata.
6. Check visual fidelity and navigation on real desktop/mobile devices before approving production.
