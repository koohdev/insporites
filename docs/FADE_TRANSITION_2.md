Implement this as a Swup-based page transition where a persistent header stays outside a nested `#swup` scroll container, and the outgoing and incoming `#swup` containers crossfade and blur in parallel during navigation.

## 1. What this resource is

This resource is a navigation and layout system, not just a CSS effect.

Behavior to preserve:
- Shared UI outside `#swup` stays mounted between pages.
- `main#swup.transition-fade` is the single content container Swup replaces.
- Scrolling happens inside `#swup`, not on `window`.
- `@swup/parallel-plugin` keeps the old and new `#swup` containers in the DOM together during the transition.
- The outgoing and incoming containers both animate with opacity and blur.
- Browser back and forward navigation animate too because `animateHistoryBrowsing: true` is enabled.
- Page-level setup inside `#swup` needs to run on the first load and again after each swap.

## 2. Compatible targets

Use this exact approach for server-rendered or multipage sites where normal same-origin links are part of the navigation flow, such as:
- Astro sites with a shared layout
- WordPress themes or other server-rendered templates
- Static or custom multipage sites using vanilla JavaScript

Before coding, inspect the target project and confirm all of these are true:
- Navigation uses normal same-origin `<a>` links that Swup can intercept.
- A shared layout or base template exists where the persistent wrapper and swapped container can live.
- The project can load Swup on every participating page.
- The project can support a nested scroll container if you are matching this resource faithfully.
- Page-level JavaScript can be split into one-time setup and post-swap re-initialization.

## 3. Not compatible with this exact implementation

Do not force this directly into framework-native client routers such as:
- Next.js
- React Router
- Nuxt
- Vue Router

If the target project depends on one of those routers, stop and explain that this resource is a Swup-style DOM replacement transition. Only continue if the user wants the behavior re-implemented around that router's own lifecycle instead of copying this setup directly.

## 4. Source stack and dependencies

Source stack:
- Astro layouts and pages
- Vanilla JavaScript
- SCSS

Core transition dependencies:
- `swup` for intercepting same-origin navigation and replacing the registered container
- `@swup/head-plugin` for keeping titles, meta tags, styles, scripts, and `html` attributes like `lang` and `dir` in sync between pages
- `@swup/parallel-plugin` for keeping the outgoing and incoming `#swup` containers alive together during the animation

Included in the source setup, but not what creates the visual effect:
- `@swup/preload-plugin` for hover, focus, and touch preloading so navigation feels faster

Demo-only extras that are not part of the core transition:
- `gsap`
- `gsap/SplitText`
- `gsap/ScrollTrigger`
- the `textReveal01()` helper and `[data-reveal-01]` attributes
- the image entrance timeline in `initLoadAnimation()`
- the nav active-state helper in `initNavActiveOnClick()`
- the preview-only `reset.js` iframe helper

## 5. Preserve or map these core pieces

Required selectors and roles:
- `.app` = viewport shell and overlap context for the transition. The class name can change, but the role cannot.
- `header` outside `#swup` = example of persistent UI that stays mounted between pages. It can be any shared UI, but it must sit outside the swapped container if it should persist.
- `#swup` = the single content container Swup replaces on navigation.
- `.transition-fade` = class already on the swapped container. The transition CSS targets this class.
- `html.is-changing` = Swup timing state during the active transition.
- `.transition-fade.is-previous-container` = outgoing container state added by `@swup/parallel-plugin`.
- `.transition-fade.is-next-container` = incoming container state added by `@swup/parallel-plugin`.
- `#swup { z-index: calc(2 - var(--swup-parallel-container, 0)); }` = stacking order Swup’s parallel plugin expects while both `#swup` copies overlap (`--swup-parallel-container` is set on each container by the plugin).
- `#swup.is-previous-container { z-index: 1; pointer-events: none; }` = keeps the outgoing copy under the incoming stack-wise where needed and prevents it from intercepting clicks while it is still in the DOM.

Illustrative, not required by name:
- `.scrollbar-hidden` = demo-only scrollbar hiding
- `.page-a`, `.page-b`, `.hero`, `.hero-content`, and other page-specific classes = showcase markup only

If the target project needs different selector names, rename them consistently in the HTML, CSS, and Swup config. Do not rename one place and leave the others behind.

## 6. Required structure

Every participating page must render the same swapped container inside the same shared shell.

```html
<body>
  <div class="app">
    <header>
      <!-- optional persistent UI -->
    </header>

    <main id="swup" class="transition-fade">
      <!-- page-specific content -->
    </main>
  </div>
</body>
```

Rules:
- `#swup.transition-fade` must exist on every page that participates in the transition.
- `.app` is only an example class name, but you still need an outer shell with the same layout job.
- UI outside `#swup` stays mounted because Swup does not replace it.
- The selector in the markup must match the selector in `containers: ["#swup"]`.
- Use normal same-origin links for navigation unless you are intentionally adapting the resource to another system.

## 7. Required layout behavior

Preserve the actual layout mechanics, not just the animation values:
- The outer shell uses `display: grid`, `grid-template-areas`, `height: 100dvh`, and `overflow: hidden`.
- The persistent header sits in the `header` grid area.
- `#swup` sits in the `main` grid area and gets `overflow-y: auto`, so it becomes the scroll container.
- `#swup` uses `position: relative` and `z-index: calc(2 - var(--swup-parallel-container, 0))` so overlapping old and new copies stack correctly with the parallel plugin.
- The parallel plugin inserts the incoming `#swup` before the outgoing `#swup`, and both containers occupy the same layout area during the animation.
- The outgoing container should use `z-index: 1` and `pointer-events: none` while it is still present.

Important implication:
- Do not assume `window` scrolling.
- Do not port this as a simple fade on an arbitrary child element.
- Do not remove the shared shell if you still want overlapping containers to behave correctly.

Minimal layout CSS to preserve:

```css
.app {
  display: grid;
  grid-template-areas:
    "header"
    "main";
  height: 100dvh;
  overflow: hidden;
}

.app > header {
  grid-area: header;
}

#swup {
  grid-area: main;
  position: relative;
  overflow-y: auto;
  z-index: calc(2 - var(--swup-parallel-container, 0));
}

#swup.is-previous-container {
  z-index: 1;
  pointer-events: none;
}
```

## 8. Background rule for overlapping transitions

Because the old and new containers overlap and blur at the same time, the visible page surfaces need to stay opaque.

In the source demo, full-height sections and image blocks paint the viewport, which helps prevent bleed-through. In the target project, do not leave overlapping page surfaces transparent. If the page content does not fully cover the viewport on its own, give `#swup`, the page sections, or another page surface a solid background color.

## 9. Required transition CSS

Use these exact transition states and values:

```css
html.is-changing .transition-fade {
  transition:
    opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.transition-fade.is-previous-container {
  opacity: 0;
  filter: blur(5px);
}

.transition-fade.is-next-container {
  opacity: 0;
  filter: blur(5px);
}
```

Notes:
- `html.is-changing` comes from Swup.
- `.transition-fade` is the class already present in the markup.
- `.is-previous-container` and `.is-next-container` come from `@swup/parallel-plugin`.
- This resource does not rely on `html.is-animating` for the core effect.

## 10. Required Swup setup

Mirror the actual source setup:

```js
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";
import SwupParallelPlugin from "@swup/parallel-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";

const swup = new Swup({
  animateHistoryBrowsing: true,
  containers: ["#swup"],
  plugins: [
    new SwupHeadPlugin({ persistAssets: true }),
    new SwupPreloadPlugin(),
    new SwupParallelPlugin(),
  ],
});
```

Important options and why they matter:
- `containers: ["#swup"]` must point to the same selector used in the markup.
- `animateHistoryBrowsing: true` means browser back and forward navigation animate too.
- `new SwupHeadPlugin({ persistAssets: true })` keeps the document head in sync and preserves styles or scripts that should survive swaps.
- `new SwupParallelPlugin()` is what creates the overlap model where old and new containers coexist.
- `new SwupPreloadPlugin()` is included in the source for faster-feeling navigation. Keep it if you want a faithful port of the resource setup, even though it does not create the blur/fade itself.

## 11. Re-initialize swapped content after navigation

Explain and preserve the lifecycle:
- `DOMContentLoaded` = the first page load
- `content:replace` = after Swup has inserted the new `#swup` content
- Anything that targets elements inside `#swup` needs to run on both
- Persistent `document`, `window`, or shared-header listeners should not be attached again on every swap

Use a split like this:

```js
function setupOnce() {
  // one-time document/window listeners
}

function initSwappedContent(scope = document) {
  // setup for elements inside #swup
}

document.addEventListener("DOMContentLoaded", () => {
  setupOnce();
  initSwappedContent();
});

swup.hooks.on("content:replace", () => {
  const next = document.querySelector("#swup");
  initSwappedContent(next);
});
```

Parallel-plugin-specific detail:
- After `content:replace`, `document.querySelector("#swup")` returns the incoming container because the plugin inserts it before the outgoing one.
- Pass that incoming container into DOM-querying helpers so they do not target matching elements in the outgoing copy.
- If you port demo-only GSAP, ScrollTrigger, or observer-based code, clean up long-lived instances when needed and recreate them for the incoming content only.

## 12. Adaptation notes for compatible stacks

Astro:
- Put the shell, persistent header, and `#swup.transition-fade` container in a shared layout like `src/layouts/Layout.astro`.
- Load the Swup script from that shared layout so it exists on every page.
- Make sure every participating page uses that layout and normal same-origin links.

WordPress or other server-rendered templates:
- Put the shared shell and swapped container in the base PHP/template layout.
- Enqueue Swup globally, not only inside one partial.
- Ensure each participating view outputs the same `#swup` container.

Custom multipage sites:
- Keep the shell in the base HTML template.
- Let Swup intercept normal same-origin anchor navigation.
- Re-run page-specific setup after `content:replace`.

## 13. What not to confuse with the core transition

These are not the core page transition and should stay out of the first implementation unless the user explicitly wants the full demo behavior:
- `gsap`, `SplitText`, and `ScrollTrigger`
- the `textReveal01()` helper and `[data-reveal-01]` attributes
- the image entrance timeline in `initLoadAnimation()`
- the nav active-state helper in `initNavActiveOnClick()`
- decorative header styling and the header entrance animation
- `.scrollbar-hidden` and other purely visual polish
- the preview-only `reset.js` file

If the user later wants the demo-only motion layer too, remember that scroll-based animation should use `#swup` as the scroller instead of `window`.

## 14. Deliverable

If the target project is compatible, produce:
- The final code in the correct files for that stack
- The shared layout or template changes needed for the shell, persistent UI, and `#swup.transition-fade` container
- The layout CSS for the grid shell, nested scroll container, `z-index` / `--swup-parallel-container` stacking, pointer-events rule on the outgoing copy, and any opaque page surfaces needed to avoid bleed-through
- The transition CSS using the exact opacity, blur, easing, and timing values above
- The Swup initialization with `animateHistoryBrowsing`, `containers: ["#swup"]`, `SwupHeadPlugin({ persistAssets: true })`, `SwupParallelPlugin()`, and, if matching the source setup, `SwupPreloadPlugin()`
- The split between one-time setup and post-swap re-initialization using `content:replace`
- Any selector or template mapping needed if the target project uses different names

If the target project is not compatible, stop and explain why this exact Swup implementation does not fit instead of forcing a broken port.