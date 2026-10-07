# Campus Store touchscreen POS

IT415 self-service kiosk: Order -> Review -> Payment -> Payment Successful -> Digital Receipt -> New Transaction.

## Run

Open `index.html` in Chrome or Microsoft Edge. No server, installation, network connection or API keys are required. Use F11 for a full-screen kiosk demonstration. All payments are simulated; the QR placeholder cannot collect money and no card details are requested.

## Features

- Six products, category filters, quantities up to 99, removal and live totals.
- Review and back navigation preserve the current order.
- Cash keypad and quick amounts, validation and change preview; simulated QR and card approval.
- Processing locks prevent duplicate payment actions.
- Payment Successful shows a UUID reference, Manila date/time, method, transaction amount, amount paid and change.
- Digital receipt lists purchased items, quantities, unit prices, subtotals and payment details. Print Receipt opens the browser print dialog with a receipt-only layout.
- New Transaction is available on confirmation and receipt. It clears the cart, category, cash input, transaction snapshot, reference, receipt, busy state and previous notification.
- Shared green visual style, large touch controls, keyboard focus, labelled tables, live feedback and responsive layouts.

## Files and design

| File | Responsibility |
| --- | --- |
| `index.html` | Entry point, shared brand header and progress navigation |
| `core.js` | Product data, integer-centavo arithmetic and cash validation |
| `app.js` | Screen rendering, payment simulation, completed transaction snapshot and reset |
| `styles.css` | Shared visual tokens, responsive screens, reduced motion and receipt print layout |
| `tests/` | Calculation tests and end-to-end browser regression |
| `docs/PAYMENT.md` | Member 2 payment implementation notes |
| `docs/RECEIPT-QA.md` | Member 3 changes and end-to-end evaluation checklist |
| `docs/AI-LOG.md` | AI-assisted development record |

Subtotal = unit price x quantity; total = sum of subtotals; change = amount paid - total. All values are integer centavos until formatting. QR/card record exact payment with zero change. Member 3 did not change `core.js` or these formulas.

State is held only in memory. Reloading or closing the page clears it; there is no transaction history or backend. The completed transaction captures items and totals once and is reused by both final screens. Time is displayed in Asia/Manila (PHT). UUID references are generated with the browser's `crypto.randomUUID()`.

## Verification

With Node.js installed:

```sh
node --check app.js
node --test tests/core.test.cjs
node tests/browser.test.cjs
```

Browser tests require Playwright and Microsoft Edge. Set `PLAYWRIGHT_MODULE` to an installed Playwright module path if needed; optionally set `BROWSER_EXE` to another Chromium executable. Set `QA_DIR` to an existing folder to save screenshots. See [the regression checklist](docs/RECEIPT-QA.md).

## Team evidence

Member 3 branch: `feature/receipt-ui-docs`. Add actual member names, repository URL, commit and PR links, reviewer and final integration SHA when available. This documentation does not claim that pushes, reviews or merges have occurred. Each member should be able to explain the code they demonstrate.
