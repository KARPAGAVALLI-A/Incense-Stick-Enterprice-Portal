# ISE System — Incense Stick Enterprise

A real, working React app with client-side routing — every click actually navigates to a real page, and data persists in your browser (localStorage) so it behaves like a real product demo.

## What's inside

- **Landing page** (`/`) — public marketing site
- **Sign Up page** (`/signup`) — new employees register with a `@employee.com` email; this **actually creates their record** and **sends real in-app notifications** to both the Admin and the new Employee
- **Login page** (`/login`) — email domain decides your role:
  - `name@admin.com` → Admin Dashboard (full access)
  - `name@manager.com` → Manager Console (view-only — employee work + orders)
  - `name@employee.com` → Employee App
- **Admin Dashboard** (`/admin`) — Dashboard, Employees, Production, **Orders** (all real routes)
- **Manager Console** (`/manager`) — read-only view of employee work and order status, for oversight without edit rights
- **Employee App** (`/employee`) — biometric (fingerprint/face) attendance flow, with its own notifications

### Features that actually work
- 🔔 **Notification bar** — real dropdown, unread badge count, click to mark read, "mark all read". New employee sign-ups push a live notification to Admin automatically.
- 🔍 **Search bar** — live search across employees and products, click a result to jump to that page.
- 📥 **Download Report** — the button generates and downloads a real `.csv` file of whatever table you're viewing.
- 🚚 **Order Tracking** — a 4-step status tracker (Placed → Processing → Shipped → Delivered). Admin can advance the status; Manager sees the same tracker read-only.
- 👥 **New Employee Signup** — registering actually adds the employee to the Employees table (visible to Admin/Manager instantly) and fires notifications to both sides.

Built with **React 18 + Vite + React Router**. Plain CSS (same navy/blue design system throughout). Data is stored in `localStorage` under the hood, so it survives page refreshes and stays in sync if you open the admin and employee views in two different tabs.

## How to run it

You'll need [Node.js](https://nodejs.org) installed (v18 or newer).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`) in your browser.

## Try the full flow

1. Open the site → marketing homepage
2. Click **"New Employee?"** → fill in the sign-up form with any `@employee.com` email → submit
   - This creates a real employee record and sends a notification to Admin
3. Click **Sign In**, log in as `ravi@admin.com` (any password)
4. Click the 🔔 bell in the top bar — you'll see the "New employee registered" notification
5. Click **Employees** in the sidebar — the new employee is in the table
6. Click **Download Report** — a real CSV downloads to your computer
7. Click **Orders** — click "Mark as Processing →" on an order, watch the status tracker move and a new notification appear
8. Sign out, sign back in as `priya@manager.com` — you get the read-only Manager Console (Employee Work + Orders, no edit buttons)
9. Sign out, sign in as the employee email you just created — the Employee App opens, with its own "Welcome" notification waiting in the bell icon

## Build for production

```bash
npm run build
```

This outputs a `dist/` folder you can deploy to any static host (Netlify, Vercel, GitHub Pages, or your own Node/Express server).

## Project structure

```
src/
  main.jsx                    — app entry point, sets up BrowserRouter
  App.jsx                     — all routes + providers wired here
  index.css                   — global design tokens (colors, fonts)
  context/
    AuthContext.jsx            — who's logged in + role detection (admin/manager/employee)
    DataContext.jsx            — employees & orders, persisted to localStorage
    NotificationContext.jsx    — real notification system, persisted to localStorage
  components/
    NotificationBell.jsx        — dropdown bell used in Admin/Manager/Employee headers
    SearchBar.jsx                — live search across employees & products
  data/
    mockData.js                 — seed data (products, past employees)
  pages/
    Landing.jsx / .css           — public homepage
    Login.jsx / .css             — 3-role email-based sign in
    Signup.jsx                   — new employee registration
    EmployeeApp.jsx / .css       — biometric attendance screen
    admin/
      AdminLayout.jsx / .css      — sidebar shell (search + notifications)
      Dashboard.jsx                — KPIs + quick links
      Employees.jsx                 — present/past tables + real CSV download
      Production.jsx                — clickable product cards + detail panel
      Orders.jsx                    — order status tracker, admin can advance
    manager/
      ManagerLayout.jsx             — read-only sidebar shell
      ManagerHome.jsx                — reuses Employees (read-only)
      ManagerOrders.jsx              — reuses Orders (read-only)
```

## Important limitation: this is NOT sending real emails

"Notifications" here are **real, working, in-app notifications** (stored in your browser, shown in the 🔔 bell) — but they are **not real emails**. No message is sent to anyone's actual inbox. To send real emails when a new employee signs up, you'd need one of:

- **A backend + email service**: a small Node.js/Express server using [Nodemailer](https://nodemailer.com) with an SMTP provider (Gmail, SendGrid, AWS SES, etc.)
- **A frontend email service**: [EmailJS](https://www.emailjs.com) — lets you send real emails straight from React with just an API key, no backend needed. This is the fastest way to upgrade the Sign Up flow to send real emails.

Ask me and I can wire up either option once you have an account/API key for one of them.

## Next steps (connecting to a real backend)

Right now data lives in `localStorage`, not a real database. To make this fully production-ready:

1. Replace `AuthContext.login()` with a real API call to your Node.js backend (`POST /api/login`) with real password checking
2. Replace `DataContext` with `fetch()` calls to your database (matches the `tbl_Staff`, `tbl_Order`, `tbl_ProductionBatch` tables from your schema)
3. Add a real biometric SDK on mobile (Android BiometricPrompt / iOS Face ID) — the current fingerprint/face UI is a simulated placeholder
4. Add server-side route protection so `/admin/*`, `/manager/*` and `/employee` can't be reached without a valid session token

