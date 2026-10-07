# Member 3: completion and receipt QA

## Consistency plan and implementation

Retain the existing Order/Review/Payment style: green primary actions, rounded white cards, soft green summary surfaces, shared spacing, readable supporting text and 52 px minimum buttons. Apply it to confirmation and receipt; preserve calculations and payment behavior. Receipt fields use the completed snapshot, not a recalculated order. New Transaction uses one reset function from either final screen. README conflict markers and missing-document links were repaired.

## End-to-end regression checklist

- [ ] Fresh load: six products, All category, empty cart, PHP 0 total, Review disabled.
- [ ] Add Coffee twice, Sandwich once and Soft Drink once: PHP 175 total. Increase/decrease Coffee and remove/re-add Soft Drink; check subtotals.
- [ ] Review shows correct quantities, unit prices, subtotals and total. Back preserves the order and category; Continue opens payment.
- [ ] Cash: reject blank, negative, text, more than two decimal places and insufficient amounts. PHP 100 against PHP 175 reports PHP 75 shortfall.
- [ ] Keypad digits, decimal, Backspace, Clear and quick amounts work. PHP 200 against PHP 175 previews PHP 25 change.
- [ ] Pay: controls lock during processing; repeated actions create only one completed transaction.
- [ ] Confirmation: Payment Successful, unique reference, PHT date/time, Cash, PHP 175 amount, PHP 200 paid and PHP 25 change. Heading receives focus.
- [ ] Receipt: reference/date match confirmation; Coffee qty 2 at PHP 45 = PHP 90, Sandwich qty 1 at PHP 50, Soft Drink qty 1 at PHP 35; PHP 175 total, PHP 200 paid, PHP 25 change.
- [ ] Back to confirmation preserves every completed field; View Receipt returns to the same snapshot.
- [ ] Print Receipt opens the print dialog. Preview contains receipt only, readable reference/table/totals and no navigation or action buttons. Cancel leaves transaction intact.
- [ ] New Transaction from receipt clears cart, cash, category, snapshot/reference, old receipt and feedback; Order receives focus and Review is disabled.
- [ ] Repeat New Transaction directly from confirmation; verify the same complete reset.
- [ ] Start another cash purchase: input is blank; exact payment gives zero change and a new reference.
- [ ] Complete QR and Card: correct method, exact amount paid, zero change, unique references and working receipts/reset.
- [ ] Inspect every screen at 1440, 768 and 390 px: no page overflow, readable text, matching cards/actions and buttons at least 52 px tall. Long UUID wraps.
- [ ] Keyboard: visible focus, Tab order, Enter/Space actions, heading focus after navigation, error focus on invalid submission. Live feedback announces results.
- [ ] Reduced motion: screen transitions/spinner animation honor preference. Refresh clears in-memory state.

## Automated verification

`tests/core.test.cjs` covers quantity and integer-centavo payment formulas. `tests/browser.test.cjs` covers order/review/payment, final details, receipt snapshot, unique references, reset from both final screens, print invocation/print CSS, keyboard focus, responsive widths and runtime errors. Real printer and touchscreen checks remain manual.

## Results - 7 October 2026

- All 3 core calculation tests passed.
- Full headless Microsoft Edge browser suite passed, including confirmation/receipt field equality, both reset entry points, unique references, print invocation and receipt-only print visibility.
- Responsive overflow and final/payment touch sizing checks passed at 1440, 768 and 390 px; no JavaScript page errors.
- `node --check app.js`, `node --check tests/browser.test.cjs` and `git diff --check` passed.
- Saved screenshots in local `qa/` were inspected for desktop confirmation, mobile receipt/order and tablet cash payment. Tablet payment heading now stacks to avoid overflow.
- Browser tests used the preinstalled Playwright runtime; no project dependency was added. Physical printing, real touchscreen use and assistive-technology announcements remain manual checklist items.
