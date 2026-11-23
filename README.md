# portfolio

Personal site for Channing Chen. Static HTML/CSS, no build step, no framework.

Site files live in [`portfolio-main/`](portfolio-main/).

## Pages

| File | Route | What it is |
| --- | --- | --- |
| `index.html` | `/` | Homepage — intro |
| `portfolio.html` | `/portfolio.html` | **Portfolio** — experience list and project tiles (linked as "Portfolio" in the nav) |
| `portfolio/*.html` | `/portfolio/<slug>.html` | One page per project, opened from its tile on the Portfolio page |
| `contact.html` | `/contact.html` | Email and social links |
| `writings.html` | `/writings.html` | **Writings** — blog index, linked from the footer next to LinkedIn and X |
| `writings/*.html` | `/writings/<slug>.html` | One page per post. Start from [`templates/writing-post.html`](templates/writing-post.html), then add a line to `writings.html` |

The old Resume page is archived in [`archive/resume.html`](archive/resume.html), outside the deployed folder.
To restore it, move it back into `portfolio-main/` and re-add the `Resume` link to each page's nav.

## Assets

- `styles.css` — the whole design system. Light and dark themes, keyed off `<html data-theme>`.
- `theme.js` + the small inline script in each page's `<head>` — the light/dark switch in the top right. The inline script applies the saved choice (or the system setting) before the page draws; `theme.js` handles clicks and saves the choice in `localStorage`. New pages need both, plus the `.theme-toggle` button markup (copy from any page).
- `images/paper.jpg`, `images/paper-ink.jpg` — grained-paper background, applied in `styles.css` (pre-rendered from the [Paper Shaders](https://github.com/paper-design/shaders) paper texture). The page colour underneath comes from the `--paper-*` variables.
- `images/` — project photography used on the Portfolio page.
- `fonts/inter-latin.woff2` — Inter, self-hosted and preloaded on every page so text never draws in a fallback font first.
- `public/profile.jpg`, `favicon.png` — portrait and favicon.
- `header.html`, `header.js` — shared header partial. Each page inlines its own copy of this markup;
  `header.js` is available if you'd rather fetch it at runtime. Keep the two in sync when editing nav.
- `CNAME` — custom domain (`channingchen.me`).

## Conventions

- Content width is set by two variables in `styles.css`: `--measure` (text) and `--container` (page/images).
- Project images go full container width. Add `project-figure--narrow` to a `<figure>` for low-resolution
  images so they don't get upscaled.

Originally built from [Tanmay Hinge's](https://tanmayhinge.com) portfolio template, used with permission.
