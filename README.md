# De Hoeksteen Basisschool & College Static Site

Landing page for Basisschool De Hoeksteen (Paramaribo). The site is a static bundle hosted on GitHub Pages with the custom domain `hoeksteen.sr`. Everything is plain HTML, CSS, vanilla JavaScript, and static assets (images plus PDFs). This guide helps any contributor clone the repo, understand the layout, run it locally, collaborate through feature branches, and publish from a pull request (PR).

---

## Project Architecture

No bundlers or package managers are involved.

- `index.html` - single page layout with hero, slideshow, elementary and college sections, team grid, FAQs, and modal markup (registration wizard plus protocol dialog). Navigation relies on anchors.
- `assets/app.css` - responsive styling, grids, colors, buttons, modal styles, slideshow animations, and utilities.
- `assets/app.js` - vanilla JS wrapped in an IIFE that manages:
  - mobile navigation toggle,
  - slideshow autoplay and pause on hover,
  - scroll triggered fade ins via `IntersectionObserver`,
  - multi step registration wizard with validation, summary, and message generation,
  - WhatsApp and mail helpers (`sendWhatsApp`, `sendEmail`) that embed the contact information,
  - modal helpers exposed through `window._hoeksteenModalFns`.
- `assets/images/` - favicon, logo, slideshow photos, and staff portraits referenced inside `index.html`.
- `docs/` - downloadable PDFs linked from the public site.
- `CNAME` - keeps the custom domain `hoeksteen.sr` active on GitHub Pages.
- `LICENSE` - repository license.

Saving edits is enough; GitHub Pages serves whatever lives on `main`.

---

## Prerequisites

1. Git 2.30 or newer.
2. Code editor (VS Code recommended; Live Server works well).
3. Ability to run a lightweight local server:
   - Python 3.11+: `python -m http.server 4173`
   - Node.js 18+: `npx serve .`
   - VS Code Live Server (open `index.html`).

---

## Repository Owner Checklist

1. **Add collaborators**
   - GitHub -> Settings -> Collaborators & teams -> Add people.
   - Only the owner can invite collaborators so they can push remote branches.

2. **Protect `main`**
   - GitHub -> Settings -> Branches -> Add branch protection rule -> `main`.
   - Enable "Require a pull request before merging", add required checks if available, and include administrators.

3. **Verify GitHub Pages**
   - GitHub -> Settings -> Pages.
   - Source: Deploy from a branch. Branch: `main`, folder `/`.
   - Ensure `hoeksteen.sr` is configured, DNS CNAME points to `cname.github.io`, and SSL is active. Update both DNS and the `CNAME` file if the domain changes.

---

## Standard Development Workflow

```bash
# 1. Clone
git clone git@github.com:hoeksteen/hoeksteen-site.git
cd hoeksteen-site

# 2. Sync main
git fetch origin
git checkout main
git pull origin main

# 3. Branch from main
git switch -c feature/update-hero-copy
```

Work only on feature branches. Commit locally and push (`git push -u origin feature/update-hero-copy`) before opening a PR.

---

## Local Preview and QA

1. Start a static server from the repo root:
   ```bash
   python -m http.server 4173
   # or
   npx serve .
   ```
2. Open `http://localhost:4173`.
3. Manually verify:
   - navigation menu and anchor jumps,
   - slideshow autoplay and hover pause,
   - registration wizard (all steps, validation, summary, WhatsApp/mail buttons),
   - downloads in `docs/`,
   - browser console free of errors.

> Opening `index.html` through `file://` may block clipboard access or trigger mixed content warnings, so always use a local HTTP server.

---

## Implementation Guidelines

- **HTML (`index.html`)**
  - Follow the existing `.section` pattern and give each new section an `id` if navigation should link to it.
  - Link new documents via relative paths (for example `docs/admissions.pdf`). Keep copywriting consistent with the current Dutch tone.

- **CSS (`assets/app.css`)**
  - Reuse CSS variables, spacing utilities, and breakpoint structure.
  - Add short comments only when logic would not be obvious.
  - Test on phone widths (around 320 px) and large desktops (around 1440 px).

- **JavaScript (`assets/app.js`)**
  - Keep logic inside the existing IIFE. Expose new handlers via `window._hoeksteenModalFns` if they must be global.
  - Keep `totalSteps`, `.wizard-step[data-step]`, and `.step` indicators in sync.
  - Update the phone or email strings in `sendWhatsApp` / `sendEmail` whenever contact info changes.
  - Avoid new dependencies; the deployment pipeline assumes static assets only.

- **Assets**
  - Compress new images before committing; files above about 1 MB hurt page load.
  - Use lowercase names without spaces for easier referencing.

- **Documentation**
  - Update this README whenever the workflow or deployment process changes.
  - Mention new PDFs or public documents in the PR description.

---

## Publishing Through GitHub Pages

1. Push the feature branch and open a PR against `main`.
2. Request a review from the owner/collaborator.
3. After approval, merge into `main`.
4. GitHub Pages redeploys automatically. Monitor progress via:
   - GitHub -> Actions (Pages build workflow), or
   - Settings -> Pages -> GitHub Pages deployments.
5. When the deploy finishes, smoke test `https://hoeksteen.sr`:
   - confirm the new content is visible,
   - check that HTTPS is still valid,
   - ensure there are no mixed content warnings (especially if assets were moved or renamed).

There is no manual build; deployment mirrors the content of `main`.

---

## Pre PR Checklist

- HTML, CSS, and JS cleaned up (no leftover console logs).
- Registration wizard still works in every step and modals open/close properly.
- Relative paths (`assets/`, `docs/`, `CNAME`) verified.
- Tested in at least one Chromium browser (Chrome/Edge) and another engine if available (Firefox or Safari).
- Screenshots or Loom attached to the PR when UI changes are noticeable.
- PR description states purpose, manual test steps, and configuration impact if applicable.

---

## References

- GitHub Pages documentation: https://docs.github.com/pages
- Font Awesome (icons via CDN): https://fontawesome.com/
- Contact details kept in `assets/app.js`: `contact@hoeksteen.sr` and WhatsApp `+597 882 5406`.

Welcome to the project!
