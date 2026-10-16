# orchard-web

The landing page for [Orchard](https://github.com/ambiapps/orchard). Plain HTML and CSS in `site/`, no build step.

Preview locally:

```bash
python3 -m http.server --directory site
```

Pushes to `main` deploy to GitHub Pages via `.github/workflows/pages.yml`. All paths are relative, so the site works at a domain root or under a sub-path.
