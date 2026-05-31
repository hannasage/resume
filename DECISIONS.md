# DECISIONS — resume

## @hannasage/projection-ui integration (2026-05-31)

### What was migrated

**SkillTag → Badge**: 1:1 swap. `Badge` from projection-ui replaces the local `SkillTag` component. Both render an inline pill with an accent-colored dot prefix. `className="tracking-widest2"` and `style={{ letterSpacing: '0.2em' }}` passed to Badge to preserve the Tailwind letter-spacing that was part of SkillTag's original Tailwind classes.

**CSS var bridge in applyVisualPalette.ts**: The existing ThemeContext already applies all theme colors as CSS custom properties on `document.documentElement`. Extended it to also set the `--ui-*` vars that projection-ui components consume. This means all library components (Badge, Card, Button, etc.) automatically pick up the active theme — including party mode color cycling, since `applyVisualPalette` is called on every animation frame during party transitions.

**Tokens import in layout.tsx**: `@hannasage/projection-ui/tokens` imported as a CSS side-effect. Sets `--ui-*` default values on `:root` for SSR correctness. The ThemeContext's `useLayoutEffect` immediately overrides these with the correct theme on hydration.

**Radius preset — sharp**: Set `--ui-radius-sm: 2px`, `--ui-radius-md: 4px`, `--ui-radius-lg: 6px` in the bridge. Matches `rounded-sm` (Tailwind) used throughout the resume's existing design.

### What was deliberately NOT migrated

**Button**: The resume's Button component uses `btn-primary-cta` and `btn-secondary-cta` CSS classes defined in globals.css — these produce a multi-stop gradient + glow + box-shadow CTA style that is a core visual differentiator of the resume. The library's primary Button is a flat accent fill. Replacing it would silently drop the gradient aesthetic without any visible error. Decision: leave Button local until projection-ui adds a gradient CTA variant (planned for v0.2.0 with a `secondary` color token).

**Card**: The resume's Card uses the `.panel` CSS class + Tailwind padding utilities for layout. Library Card uses inline styles. Both resolve to the same surface/border colors after the CSS var bridge. No functional difference. Decision: leave local since there is zero user-facing benefit to swapping an identical component.

**ThemeContext / ThemeProvider**: The existing ThemeContext manages the 12-theme system, party mode lerp animation, localStorage persistence, and SSR suppression. The library's ThemeProvider is a simpler single-theme wrapper. Using both would create parallel state. Decision: keep existing ThemeContext, bridge via applyVisualPalette.

**PartyThemeAnimator**: The rAF-based color interpolation is complex and not part of projection-ui. Left dormant in ThemeContext as-is; it will naturally set --ui-* vars too via the updated applyVisualPalette bridge.
