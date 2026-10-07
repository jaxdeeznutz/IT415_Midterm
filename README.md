# Campus Store touchscreen POS

A local demonstration kiosk implementing the IT415 practical exam flow: select products, review order, choose payment, complete payment, view receipt and start a new transaction.

## Run

Open **index.html** in Microsoft Edge or Google Chrome. No install, server, network or API keys are required. Extract the ZIP before opening. For a kiosk demonstration, use the browser's full-screen mode (F11).

All payments are simulated. The QR placeholder cannot collect money; card processing does not request or store card information.

## Features

- Six sample products with prices, categories and large touch cards.
- Increase/decrease quantities (0–99), remove items, live subtotals and total.
- Review and back navigation preserving the cart; empty checkout disabled.
- Cash keypad, quick amounts, typed decimal input and insufficient/invalid payment feedback.
- QR confirmation and a short card-processing state with controls locked.
- Unique UUID transaction reference, success screen and printable receipt.
- New Transaction clears cart, payment amount, receipt, reference and category.
- Responsive layout, labelled controls, visible keyboard focus and status messages.

## Files and architecture

`index.html` is the entry point. `styles.css` controls presentation and print layout. `core.js` contains product data, centavo arithmetic and cash validation. `app.js` renders the screens and handles transitions. Completed transactions snapshot their items so the receipt represents the paid order. Amounts use integer centavos to avoid floating-point errors. Receipt time uses Asia/Manila.

Storage is intentionally in memory. Refreshing or closing the page clears the current order and receipt; there is no persistent transaction history. Product quantities are limited to 99 per item as a usability guard, not a stock count. Cash accepts up to seven whole-number digits and two decimals; commas, exponents and negative numbers are rejected.

## Tests

With Node.js installed, run from this folder:

```
node --test tests/core.test.cjs
```

The browser test requires Playwright and Microsoft Edge. Set `PLAYWRIGHT_MODULE` to an installed Playwright module path if it is not available through normal Node resolution, then run `node tests/browser.test.cjs`. It opens the local index.html; no server is needed.

See `docs/ACCEPTANCE.md` for verification results and `docs/PLAN.md` for the implementation plan.

## Group contribution evidence

The provided checklist also requires a real shared GitHub repository, local clone, at least seven genuine development stages, member feature branches, pushes, pull requests, review before merge and an identified final integration commit. Those records are not created by this package. No member names, repository URL or access instructions were supplied.

Complete the following with actual evidence:

| Member | GitHub account | Feature and branch | Commits | PR | Reviewer and merge status |
| --- | --- | --- | --- | --- | --- |
| To be supplied by the group | | | | | |

Repository URL: pending. Integration branch and final SHA: pending. Instructor access verification: pending.

See `docs/AI-LOG.md` for the AI assistance record. Each member should understand and explain the code they demonstrate.
