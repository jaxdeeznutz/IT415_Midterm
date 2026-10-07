# Member 1 — Item Selection and Order Review

Branch: feature/item-selection. Open index.html in Edge or Chrome; no installation is needed.

## Changes

- app.js: clearer selection instructions, selected-quantity badges and accessible names, category counts, review icons/categories, and item-aware feedback. Keeps focus in the control area used and preserves cart-list scroll position after quantity changes. Filtering restores focus to the selected category.
- styles.css: scoped selection/review styles using the existing green palette, shared touch/surface tokens, larger labels, 52px quantity buttons, and a scrollable sticky desktop order panel. At narrow widths the order panel follows the catalog. Review remains a semantic table with an accessible caption.
- core.js, index.html, product prices, integer-centavo calculations, and payment handlers are unchanged. No runtime dependencies added.

## Manual acceptance checklist

Start with a fresh page. Unless specified, follow these tests in order.

| Test | Action | Expected result |
| --- | --- | --- |
| Empty state | Open index.html. | Six product cards show icons, names, categories and prices. Total is ₱0.00; Review is disabled. Order is the active step. |
| Selection | Tap Coffee twice, Sandwich once, Soft Drink once. | Badges show 2, 1, 1. Four items in the bag; subtotals ₱90.00, ₱50.00, ₱35.00; total ₱175.00. Each tap gives a brief status message. |
| Filtering | Select Drinks, Food, Snacks, then All. | Respectively 3, 1, 2, 6 products. Active category is distinct; cart and total stay unchanged. |
| Increase | Tap Coffee + in the order panel. | Quantity 3, Coffee subtotal ₱135.00, total ₱220.00. Feedback names the updated quantity. |
| Decrease | Tap Coffee −. | Quantity 2, Coffee subtotal ₱90.00, total ₱175.00. |
| Remove | Tap Remove on Soft Drink. | Soft Drink disappears from cart, its selected badge clears, total becomes ₱140.00; removal is announced. |
| Review | Tap Review your order. | Coffee ×2 and Sandwich ×1 with unit prices, subtotals and ₱140.00 total. Review is the active global step; all four step labels remain visible. |
| Back | Tap Back. | Same products, quantities, subtotals and total remain selected. Previously selected category is retained. |
| Remove at zero | Remove Sandwich, then tap Coffee − twice. | Coffee is removed at zero, no negative quantity, total ₱0.00, empty state returns and Review is disabled. |
| All products | Select All and tap each of the six products once. | Six items, total ₱200.00; the order list can scroll to every item. |
| Quantity cap | On a fresh page, add Coffee until quantity reaches 99, then tap + again. | Quantity stays 99; total ₱4,455.00; maximum-quantity message appears. |
| Keyboard focus | Use Tab and Enter for a filter and cart +/−; remove an item while it is hidden by a filter. | Focus stays on the used filter/control where possible, or returns to the product/selected filter after removal. Visible focus outlines remain. |
| Laptop/kiosk | Check 1920×1080, 1366×768, 1024×768 and 768×1024 with a full cart. | No page-wide horizontal overflow. Order panel stays beside catalog; total and Review button remain visible while its items scroll. |
| Narrow layout | Check 390×844 and 320×640, including Review. | Cards use two columns; filters wrap; order panel follows catalog. No page-wide horizontal overflow; quantity/filter/remove controls are at least 48px in both dimensions. |
| Reduced motion | Enable reduced motion in OS/browser settings. | UI remains usable with animations and transitions suppressed. |

## Verification performed

- Node syntax check: passed.
- Existing core test suite: all 3 tests passed (cart arithmetic plus existing cash-validation regression checks).
- Headless Microsoft Edge via a temporary DevTools runner: passed six products, all category counts, selection, increment/decrement, remove, removal at zero, arithmetic, review/back, focus retention/fallback, 99-item cap, touch-target sizing, and Order/Review overflow checks at all six viewport sizes above. Desktop checkout visibility also passed.
- Visually inspected the populated order screen at 1366×768.
- Existing Playwright browser suite could not run because Playwright is not installed. The temporary Edge runner checked item-selection scope; it did not exercise the complete payment/receipt flow.
- Manual physical touchscreen and reduced-motion checks remain for the demonstrator.

The pre-existing README.md conflict markers were left untouched.
