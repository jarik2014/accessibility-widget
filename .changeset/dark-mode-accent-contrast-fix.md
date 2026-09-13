---
"@blakfy/accessibility-widget": patch
---

Fix dark-theme text/icon invisibility: `--blakfy-a11y-primary` was never
overridden for `[data-theme='dark']`, so every panel element that used it as
a foreground color directly on the panel/card surface (reset button, active
profile outline, profile icons, stepper +/- buttons, "Blakfy Studio" branding
name) rendered near-black text on the near-black dark panel background.
Introduced a dedicated `--__accent-fg` internal token (black in light, white
in dark) for these foreground-only usages, left `--blakfy-a11y-primary`
untouched since it is always paired with `--blakfy-a11y-primary-text` as an
accent background (FAB, switches, opt-btn) and already carried its own
contrast. Also fixed `--blakfy-a11y-focus-ring`, which had the same
never-overridden-in-dark bug.
