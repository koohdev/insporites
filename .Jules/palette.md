## 2024-06-25 - Filter Bar Search Accessibility
**Learning:** Found an accessibility issue specific to `FilterBar` component's input element which lacked an `aria-label`.
**Action:** Always verify that input fields that rely on an icon and placeholder text have explicit `aria-label` attributes to ensure screen reader users have a descriptive name. Added `aria-label` attribute to the search `<input>`.
