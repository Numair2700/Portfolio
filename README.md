# Numair Alsaleh — Portfolio

A scroll-animated portfolio site. Plain HTML, CSS and JavaScript: no build step and nothing to install.

- **GSAP + ScrollTrigger** drive the scroll animations (pinned sections, word reveal, counters, sideways project cards).
- **Lenis** smooths the scrolling.
- A **2D canvas** draws the dot sphere in the background.

All three libraries load from a CDN, so the site needs an internet connection the first time it opens.

## Run it locally

Any static server works. With Python:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Files

| File | What it holds |
|---|---|
| `index.html` | All content: name, pitch, numbers, projects, contact |
| `styles.css` | Look and layout; colors are variables at the top |
| `main.js` | Scroll animations and the canvas sphere |

## Work on it from another device

Push this folder to GitHub once, then on the other device:

```bash
git clone https://github.com/Numair2700/portfolio.git
```

After that, `git pull` before you start and `git push` when you finish.

## Publish it

GitHub Pages serves this folder as-is: repo Settings → Pages → Deploy from branch → `main` / root.
