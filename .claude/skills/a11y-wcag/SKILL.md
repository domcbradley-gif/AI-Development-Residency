---
name: a11y-wcag
description: Makes UI accessible to WCAG 2.2 AA. Use when building or reviewing any user interface, component, form, page, or styling.
---

Apply these to any UI you write or review. Target WCAG 2.2 Level AA.

1. Use semantic HTML: real <button>, <a>, <nav>, <main>, <label>, headings in order. Reach for ARIA only when no native element fits.
2. Label every form control with a <label> tied to it (for/id), not just placeholder text.
3. Keyboard: everything usable without a mouse. Logical tab order, a visible focus indicator, no keyboard traps.
4. Color: at least 4.5:1 contrast for normal text. Never use color as the only way to convey meaning (add text or an icon).
5. Images: meaningful images get descriptive alt text; decorative images get alt="".
6. Dynamic changes (errors, toasts, loading): announce them to screen readers (e.g. aria-live) and move focus where it makes sense.
7. Respect prefers-reduced-motion for animation.

Compliance bar: WCAG 2.2 AA, because that is what the ADA, Section 508, and most procurement actually require. Where practical, also follow the direction of WCAG 3.0 — judge by real user outcomes and validate with assistive-tech users — but keep 2.2 AA as the firm bar until 3.0 is finalized.
