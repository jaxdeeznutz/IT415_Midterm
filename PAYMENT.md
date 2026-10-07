# Member 2: Payment processing

Implemented on feature/payment-processing. The redesign reuses the Order screen's sage surfaces, green primary actions, rounded cards, and typography. The amount due stays prominent and the selected method has a border, fill, Selected label, and aria-pressed state.

Cash includes a large amount field, 64px keypad keys, exact/200/500/1000 quick amounts, change preview, and Pay Now. QR uses an explicitly non-scannable placeholder. Card uses a simulated reader. All payments have a 1.4-second processing state, disabled controls, and duplicate-submission guards before using the existing transaction completion function. Back to Review preserves the cart; Change Payment Method clears cash entry.

Validation continues to use core.js integer-cent arithmetic. Empty or malformed amounts cannot submit. Negative values, commas, exponents, more than seven integer digits, and more than two decimal places are rejected. Insufficient cash displays the total required and shortage. Valid sufficient cash shows change immediately. The keypad limits fractional input to two digits; typed input is validated identically by core.js. No gateway, card data collection, cart calculation, or Receipt rendering changes.

## Acceptance cases

| Case | Action | Expected result |
| --- | --- | --- |
| Insufficient cash | Due PHP175; enter PHP100; Pay Now | PHP75 shortage, remain on cash, no transaction |
| Exact cash | Due PHP175; use Exact amount; Pay Now | PHP0 change, processing, successful Cash transaction |
| Excess cash | Due PHP175; enter PHP200; Pay Now | PHP25 preview and recorded change |
| Invalid cash | Submit blank, negative, letters, or 175.001 | Inline error; no processing or transaction |
| QR | Select QR; Confirm Payment | Clearly marked demo, processing, exact due paid, zero change |
| Card | Select card; Process Payment | Reader processing feedback, exact due paid, zero change |
| Navigation | Back to Review; return; Change Payment Method | Cart preserved, method selector available, cash cleared on methods screen |
| Repeated taps | Trigger payment again during processing | Controls locked, only one transaction |
| Keypad | Enter 50.259, then Delete and Clear | 50.25 maximum precision; delete one digit; clear entry |
| Responsive | View all payment methods at 1440, 768, 390px | No horizontal overflow; controls remain usable |

## Verification

Passed: node --test tests/core.test.cjs (3 tests), tests/browser.test.cjs (existing end-to-end regression), tests/payment.test.cjs (focused payment checks), node --check app.js, and git diff --check. Browser checks use Playwright and Microsoft Edge; set PLAYWRIGHT_MODULE to the installed Playwright module when needed. Optional QA_DIR captures payment screenshots. The existing browser test now waits for asynchronous cash and QR completion.
