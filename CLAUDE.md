# Portfolio site — context for Claude

Scroll-animated portfolio for Numair Alsaleh (developer: Laravel, React, TypeScript).

- Static site, no build step: `index.html`, `styles.css`, `main.js`. Do not add a bundler or framework unless asked.
- Animation: GSAP 3 + ScrollTrigger and Lenis, loaded from CDN in `index.html`. The background dot sphere is a 2D canvas in `main.js`.
- CSS shows every element in its final state; JS animates *from* hidden states. Keep it that way so reduced-motion and no-JS still read fine.
- Look: dark ground `#0E0E10`, lime accent `#C6F432`, Space Grotesk headings, Inter body. Variables are at the top of `styles.css`.
- Project facts (numbers, stack, repo links) come from Numair. Never invent stats or copy; ask or leave a clear placeholder.
- Preview: `python -m http.server 5173` from this folder.
