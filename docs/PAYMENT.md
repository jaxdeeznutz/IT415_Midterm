# Member 2: Payment experience

## Design

Reuse the Order screen's green accent, rounded white surfaces, muted supporting text and shared touch-size tokens. Keep three payment cards visible with a border, tinted surface, Selected label and aria-pressed state. Show amount due and item count above the payment controls. Cash uses a two-column entry/keypad layout that stacks on small screens. QR uses an explicitly non-scannable placeholder; card uses a simulated reader panel.

## Validation and processing

The existing core.js validation and integer-cent calculations are unchanged. Empty, negative, nonnumeric, overprecision and out-of-range cash values cannot complete payment. Nonempty invalid input shows inline feedback immediately; submitting an empty field shows an error and focuses the field. Insufficient cash states the required total and exact shortfall. Change is shown only for valid, sufficient amounts. Quick amounts replace the entered amount; Clear empties it; Backspace removes the final character.

All methods simulate processing for 1.4 seconds. Payment input, method selection and navigation are disabled during processing, with a live status and spinner. A busy guard and the existing transaction guard prevent duplicate completion. QR and card record the exact amount due and zero change. No gateway, card data collection, or real QR payment is implemented.

Back to Review preserves the cart. Change Payment Method clears cash entry. Switching directly between method cards preserves cash until the method chooser is opened; a new transaction uses the existing reset flow. Receipt rendering, transaction fields, cart arithmetic and Order/Review markup are unchanged.

## Acceptance cases

| Case | Steps | Expected |
| --- | --- | --- |
| Insufficient cash | For PHP 175 due, enter 100 and Pay Now | Remain on Cash; PHP 75 shortfall; no transaction |
| Exact cash | For PHP 175 due, enter 175 or choose Exact | PHP 0 change; processing then success |
| Excess cash | For PHP 175 due, enter 200 | PHP 25 change in preview and completed transaction |
| Invalid cash | Submit blank, -10, abc or 175.001 | Inline error; field marked invalid; no transaction |
| Keypad | Enter 40, Backspace, 5, decimal, 2, 5 | 45.25 entered; Clear empties the field |
| QR simulation | Choose QR, Confirm Payment | Status appears; all controls locked; exact due paid; zero change |
| Card simulation | Choose Card, Process Payment | Reader processing text and status; controls locked; success after delay |
| Navigation | Cash to method chooser to Review to Order | Cash cleared at chooser; cart and total preserved |
| Duplicate action | Dispatch another confirmation while busy | Only one transaction completed |
| Responsive UI | Inspect Cash, QR and Card at 1440, 768 and 390 px | No horizontal overflow; payment buttons at least 52 px tall |

## Verification

- `node --test --test-isolation=none tests/core.test.cjs`: 3 tests passed.
- `node tests/browser.test.cjs`: full browser regression passed in headless Microsoft Edge, using the available Playwright runtime via PLAYWRIGHT_MODULE.
- Browser coverage includes existing cart, receipt, unique-reference and reset regressions, plus payment navigation, selection, keypad, processing lock and responsive checks.
- `node --check app.js` and `git diff --check` passed.
