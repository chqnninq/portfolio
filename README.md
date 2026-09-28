# portfolio

Personal site for Channing Chen. Static HTML/CSS, no build step, no framework.

Site files live in [`portfolio-main/`](portfolio-main/).

## Pages

| File | Route | What it is |
| --- | --- | --- |
| `index.html` | `/` | Homepage — intro, Currently / Previously |
| `projects.html` | `/projects.html` | **Work** — numbered project write-ups (linked as "Work" in the nav) |
| `resume.html` | `/resume.html` | Resume, linking `Channing_Chen_Resume.pdf` |
| `contact.html` | `/contact.html` | Email and social links |
| `gallery.html` | `/gallery.html` | Photo grid with lightbox (footer link; empty until photos are added) |

## Assets

- `styles.css` — the whole design system. Light by default, dark via `prefers-color-scheme`.
- `images/` — project photography used on the Work page.
- `public/profile.jpg`, `favicon.png` — portrait and favicon.
- `header.html`, `header.js` — shared header partial. Each page inlines its own copy of this markup;
  `header.js` is available if you'd rather fetch it at runtime. Keep the two in sync when editing nav.
- `CNAME` — custom domain (`channingchen.me`).

## Conventions

- Content width is set by two variables in `styles.css`: `--measure` (text) and `--container` (page/images).
- Project images go full container width. Add `project-figure--narrow` to a `<figure>` for low-resolution
  images so they don't get upscaled.

Originally built from [Tanmay Hinge's](https://tanmayhinge.com) portfolio template, used with permission.
