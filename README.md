# Digital Tasbih (Counter Test)

A lightweight Digital Tasbih counter with phrase presets, progress, stats, long-press, and keyboard controls.

## Features
- Phrase presets with Arabic and English labels
- Circular counter with animated progress bar to target (default 33)
- Session and total counts (persisted in localStorage)
- Increment controls: click/tap +, press-and-hold (auto after 300ms), keyboard Space/+; r to reset session
- Haptic vibration on supported devices
- Visual effects: button feedback, subtle animations, confetti on completion

## Run
- Open `index.html` in any modern browser. No build step required.

## Controls
- Click/Tap `+`: increment by 1
- Hold `+` (≥300ms): auto-increment until release
- Keyboard: `Space` or `+` to increment; `r` to reset session

## Data
- Stored under `digitalTasbih` key in localStorage:
  - `totalCount`
  - `lastPhrase`

## Customization
- Target: change `this.target` in `main.js` (default 33)
- Phrases: edit the phrase buttons in `index.html`
- Theme: adjust CSS variables and styles in `style.css`

## Files
- `index.html` — UI structure
- `style.css` — styles and animations
- `main.js` — logic, events, storage, effects

## Accessibility
- Increment button has `aria-label`
- Keyboard shortcuts available

## Notes
- Long-press avoids double increments by delaying start and suppressing the post-press click
