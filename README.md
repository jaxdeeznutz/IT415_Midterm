# Campus Store Touchscreen POS

A touchscreen-oriented self-service Point of Sale kiosk developed for the **IT415 – Application Development and Emerging Technologies Practical Examination**.

The system follows the required transaction flow:

**Order → Review → Payment → Payment Successful → Digital Receipt → New Transaction**

The application is implemented using **HTML, CSS, and JavaScript only**. No backend or database is required because the practical examination uses a simulated local kiosk transaction flow.

---

## Live System

Hosted using Vercel:

**https://campusstore-inky.vercel.app**

---

## GitHub Repository

**https://github.com/jaxdeeznutz/IT415_Midterm**

---

## Features

- Six selectable products with names, categories, prices, and large touchscreen-friendly cards
- Category filtering for All, Drinks, Food, and Snacks
- Product selection by clicking or tapping
- Increase and decrease product quantities
- Remove products from the current order
- Automatic item subtotal calculation
- Automatic total calculation
- Order Review screen
- Back navigation while preserving selected items
- Three payment methods:
  - Cash
  - QR Payment
  - Credit / Debit Card
- Cash payment validation
- Insufficient payment rejection
- Exact payment support
- Automatic change calculation
- Simulated QR payment
- Simulated Credit/Debit Card payment
- Processing state and duplicate-payment protection
- Payment Successful confirmation screen
- Unique transaction reference using `crypto.randomUUID()`
- Manila date and time display
- Digital receipt
- Receipt item quantities, unit prices, subtotals, total, payment method, amount paid, and change
- Print Receipt option using the browser print dialog
- New Transaction reset
- Responsive touchscreen-oriented interface
- Accessible labels, focus states, feedback messages, and large touch controls

---

## Technology Used

- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- Visual Studio Code
- OpenAI Codex for AI-assisted development
- Vercel for deployment

No external frontend framework, backend framework, database, or real payment gateway is used.

---

## Project Files

| File / Folder | Purpose |
| --- | --- |
| `index.html` | Main application entry point and shared kiosk structure |
| `styles.css` | UI styling, responsive layout, touchscreen design, and print layout |
| `core.js` | Product data, transaction calculations, and cash validation |
| `app.js` | Screen rendering, navigation, cart actions, payment simulation, receipt, and reset |
| `tests/` | Calculation and browser regression tests |
| `docs/PAYMENT.md` | Payment-processing implementation and validation notes |
| `docs/RECEIPT-QA.md` | Receipt, reset, and final regression checklist |
| `docs/AI-LOG.md` | AI-assisted development record |
| `README.md` | Project overview and development evidence |

---

## Transaction Calculations

The application uses integer centavos internally to avoid floating-point calculation issues.

```text
Item Subtotal = Unit Price × Quantity

Transaction Total = Sum of all item subtotals

Cash Change = Amount Paid − Transaction Total
