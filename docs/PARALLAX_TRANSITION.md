Implement this exact GSAP-based section transition system in the user's existing project. Adapt it to the project's real stack and file structure. Do not build a demo page. Do not describe the effect conceptually and stop there. Inspect the project, install what is needed, add the code in the correct files, add the needed data attributes to the correct elements, and return the finished implementation.

## 1. How to approach the task

- Inspect the project first so you understand the stack, routing, where client-side JavaScript should live, and which layout or page files control the sections.
- Reuse any existing GSAP setup if the project already has one.
- Install `gsap` if it is missing.
- Do not add demo-only code.
- If it is not obvious which sections should use `parallax`, `pin`, or `reveal`, ask the user one clear question before choosing.
- If the right sections are obvious from the page structure, choose sensible defaults yourself and tell the user what you picked.
- The final result should be integrated code in the user's project, not pseudo-code.

## 2. What to build

Build a section transition system where sibling content blocks can opt into one of three modes with data attributes:

- `data-st-01="parallax"` moves that section on the y axis while the next section enters
- `data-st-01="pin"` pins that section while the next section scrolls over it
- `data-st-01="reveal"` reveals that section from behind the section before it

Additional supported attributes:

- `data-st-y="300"` sets the y distance for `parallax` and `reveal`
- `data-st-opacity="0.5"` adds an overlay animation from `0` to a value between `0` and `1`
- `data-st-overlay="black"` sets the overlay color

Important structural rules:

- The transitioned elements should be adjacent siblings in the normal vertical page flow
- `parallax` and `pin` need a following sibling element
- `reveal` needs a previous sibling element
- `reveal` on the first element does nothing
- `pin` or `parallax` on the last element do nothing
- `pin` ignores `data-st-y`

## 3. Install the dependency

Install GSAP in the way that matches the project.

```bash
npm install gsap
```

If the project does not use NPM, adapt the installation to the project's package manager or script-loading setup.

## 4. Add the section transition code

Put this code into the appropriate client-side JavaScript file for the target project. If the stack uses modules, keep the imports. If it uses a global script setup, adapt the imports to that environment.

```js
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function sectionTransition01(scopeOrConfig = document, maybeConfig = {}) {
  const DEFAULT_CONFIG = {
    parallaxY: 400,
    revealY: 0,
    overlayColor: "black",
    mobile: {
      breakpoint: 768,
      strategy: "simplify",
    },
  };

  const isScope = (value) => value instanceof Element || value instanceof Document;

  const getConfig = (overrides = {}) => ({
    ...DEFAULT_CONFIG,
    ...overrides,
    mobile: {
      ...DEFAULT_CONFIG.mobile,
      ...(overrides.mobile || {}),
    },
  });

  const getYValue = (section, fallback) => {
    const yValue = parseFloat(section.dataset.stY || String(fallback));
    return Number.isNaN(yValue) ? fallback : yValue;
  };

  const getOpacityValue = (section) => {
    const opacityValue = parseFloat(section.dataset.stOpacity || "");
    if (Number.isNaN(opacityValue)) return null;
    return Math.max(0, Math.min(1, opacityValue));
  };

  const getOverlayColor = (section, fallback) => section.dataset.stOverlay || fallback;

  const getOverlayElement = (section, color) => {
    let overlay = section.querySelector("[data-st-overlay-el]");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.setAttribute("data-st-overlay-el", "");
      overlay.setAttribute("aria-hidden", "true");
      section.append(overlay);
    }

    if (getComputedStyle(section).position === "static") {
      section.style.position = "relative";
    }

    section.style.isolation = "isolate";

    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      zIndex: "2",
      pointerEvents: "none",
      background: color,
      opacity: "0",
      willChange: "opacity",
    });

    return overlay;
  };

  const resetOverlay = (section) => {
    const existingOverlay = section.querySelector("[data-st-overlay-el]");
    if (existingOverlay) {
      gsap.set(existingOverlay, { opacity: 0 });
    }
  };

  const getConfiguredYValue = (section, mode, config) => {
    if (mode === "reveal") {
      return getYValue(section, config.revealY);
    }

    if (mode === "parallax") {
      return getYValue(section, config.parallaxY);
    }

    return 0;
  };

  const isMobileViewport = (config) => (
    window.matchMedia(`(max-width: ${config.mobile.breakpoint}px)`).matches
  );

  const getMobileStrategy = (config) => {
    const allowed = new Set(["same", "disable", "simplify"]);
    return allowed.has(config.mobile.strategy)
      ? config.mobile.strategy
      : DEFAULT_CONFIG.mobile.strategy;
  };

  const hasYMotion = (mode, y) => mode === "parallax" || (mode === "reveal" && y !== 0);

  const resolveTransition = (mode, y, strategy, isMobile) => {
    if (!isMobile || strategy === "same" || !hasYMotion(mode, y)) {
      return { mode, y };
    }

    if (strategy === "disable") {
      return { mode: "none", y: 0 };
    }

    if (mode === "parallax") {
      return { mode: "pin", y: 0 };
    }

    return { mode, y: 0 };
  };

  const scope = isScope(scopeOrConfig) ? scopeOrConfig : document;
  const config = getConfig(isScope(scopeOrConfig) ? maybeConfig : scopeOrConfig);
  const mobileStrategy = getMobileStrategy(config);
  const isMobile = isMobileViewport(config);
  const sections = scope.querySelectorAll("[data-st-01]");

  sections.forEach((section) => {
    const configuredMode = section.getAttribute("data-st-01") || "parallax";
    const configuredY = getConfiguredYValue(section, configuredMode, config);
    const opacity = getOpacityValue(section);
    const { mode, y } = resolveTransition(
      configuredMode,
      configuredY,
      mobileStrategy,
      isMobile,
    );

    if (mode === "none") {
      resetOverlay(section);
      return;
    }

    if (mode === "reveal") {
      const previousSection = section.previousElementSibling;
      if (!previousSection) return;

      gsap.set(previousSection, { zIndex: 1 });
      gsap.set(section, {
        position: "sticky",
        bottom: 0,
        zIndex: 0,
      });

      if (opacity === null) resetOverlay(section);

      if (y === 0 && opacity === null) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: previousSection,
          start: "bottom bottom",
          end: () => `+=${section.offsetHeight}`,
          scrub: true,
        },
      });

      if (y !== 0) {
        timeline.fromTo(section, {
          y,
        }, {
          y: 0,
          ease: "none",
          force3D: true,
        }, 0);
      }

      if (opacity !== null) {
        const overlay = getOverlayElement(section, getOverlayColor(section, config.overlayColor));
        gsap.set(overlay, { opacity });
        timeline.to(overlay, { opacity: 0, ease: "none" }, 0);
      }

      return;
    }

    const nextSection = section.nextElementSibling;
    if (!nextSection) return;

    if (mode === "pin") {
      ScrollTrigger.create({
        trigger: nextSection,
        start: "top bottom",
        end: "top top",
        pin: section,
        pinSpacing: false,
      });

      if (configuredMode === "parallax" && opacity !== null) {
        const overlay = getOverlayElement(section, getOverlayColor(section, config.overlayColor));

        gsap.timeline({
          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }).to(overlay, { opacity, ease: "none" }, 0);
        return;
      }

      resetOverlay(section);
      return;
    }

    const scrollTrigger = {
      trigger: nextSection,
      start: "top bottom",
      end: "top top",
      scrub: true,
    };

    const tween = {
      y,
      ease: "none",
      force3D: true,
    };

    if (opacity === null) {
      resetOverlay(section);
      gsap.to(section, { ...tween, scrollTrigger });
      return;
    }

    const overlay = getOverlayElement(section, getOverlayColor(section, config.overlayColor));

    gsap.timeline({ scrollTrigger })
      .to(section, tween, 0)
      .to(overlay, { opacity, ease: "none" }, 0);
  });
}
```

## 5. Initialize it in the right lifecycle

Use the correct lifecycle for the target stack. For plain HTML or a standard multipage site, this is the baseline:

```js
document.addEventListener("DOMContentLoaded", () => {
  sectionTransition01();
});
```

If the stack uses React, Vue, Svelte, Astro islands, or another client runtime, move that initialization to the correct mounted client lifecycle instead of leaving it in `DOMContentLoaded`.

## 6. Add the base CSS

Add the minimum CSS needed for the effect to behave well, then adapt the visual styling to the project.

```css
main {
  position: relative;
}

section {
  position: relative;
  min-height: 100vh;
  z-index: 1;
}

section[data-st-01]:not([data-st-01="pin"]) {
  will-change: transform;
}
```

That `z-index: 1` is important for the reveal mode.

If the project uses `div`, `article`, or other sibling blocks instead of `section`, apply the same CSS idea to those elements instead.

## 7. Apply the data attributes in the markup

Use the existing content structure in the project. The transitioned elements should be sibling blocks in the normal scroll flow inside the main content area.

Example pattern:

```html
<main>
  <section data-st-01="parallax" data-st-y="300" data-st-opacity="0.75">
    <!-- your content -->
  </section>

  <section>
    <!-- your content -->
  </section>

  <section data-st-01="pin">
    <!-- your content -->
  </section>

  <section>
    <!-- your content -->
  </section>

  <section>
    <!-- your content -->
  </section>

  <section data-st-01="reveal" data-st-y="240" data-st-opacity="0.5">
    <!-- your content -->
  </section>
</main>
```

Do not blindly copy this markup if the project already has real content. Instead, add the data attributes to the right existing sibling elements.

## 8. How to choose which sections get which mode

Follow this decision rule:

- If the page already has a clear hero followed by content, `parallax` is usually a good fit for the hero
- If one section should hold steady while the next one wipes over it, use `pin`
- If a section should come up from behind the one before it, especially for a CTA or footer-style block, use `reveal`

If the best choices are not obvious:

- Ask the user which sections should use `parallax`, `pin`, or `reveal`
- If helpful, list the likely candidate sections you found in the project
- Keep the question short and concrete

If the best choices are obvious:

- Add the attributes yourself
- Tell the user which sections you chose and why

## 9. Change the global defaults inside the function

If the user wants different defaults across the whole page, edit the `DEFAULT_CONFIG` object inside the function instead of passing a separate config at init time:

```js
const DEFAULT_CONFIG = {
  parallaxY: 400,
  revealY: 0,
  overlayColor: "black",
  mobile: {
    breakpoint: 768,
    strategy: "simplify",
  },
};
```

Notes:

- `parallaxY` is the shared fallback for parallax blocks
- `revealY` is the shared fallback for reveal blocks
- `overlayColor` is the shared overlay color
- `mobile.breakpoint` changes where the mobile behavior starts
- `mobile.strategy` can be `"simplify"`, `"disable"`, or `"same"`
- The default `"simplify"` mode reduces motion on smaller screens

## 10. Important caveats to preserve

- Keep the transitioned elements as adjacent siblings
- `reveal` needs a previous sibling element
- `pin` and `parallax` need a next sibling element
- `pin` ignores `data-st-y`
- Keep `z-index: 1` on the sibling blocks so the reveal layering works correctly
- `data-st-opacity` inserts or reuses an overlay element inside the section

## 11. What not to include

- Do not add demo-only viewport helpers
- Do not add demo-only placeholder sections or labels
- Do not create a showcase page if the task is to integrate the effect into an existing project
- Do not stop with generic instructions when you can make the changes directly

## 12. Expected output

Complete the implementation in the user's actual project.

Your final response should include:

- the files you changed
- what you installed
- which elements you tagged with `data-st-01`
- whether you asked the user to choose section modes or selected them yourself
- anything the user should check visually after the change