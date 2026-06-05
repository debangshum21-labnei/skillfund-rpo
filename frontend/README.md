# SkillFund Frontend MVP

Next.js 15 App Router frontend for the SkillFund MVP. The app is mock-data only:
no payments, backend services, trading execution, or wallet settlement are connected.

## Routes

- `/` landing page
- `/login` login UI
- `/register` registration UI
- `/dashboard` account and session overview
- `/deposit` mock deposit setup
- `/terminal` simulated trading terminal
- `/session-results` settlement and cooldown state

## Architecture

```text
src/
  app/                 App Router pages and global styles
  components/
    ui/                shadcn-style primitives
    layout/            Navbar, footer, sidebar, app shell
    marketing/         Landing page sections
    dashboard/         Wallet, reward, session, deposit widgets
    trading/           Terminal, chart, PnL, positions widgets
  lib/                 Utilities and mock data
  types/               Shared domain types
```

## Commands

```sh
npm install
npm run dev
npm run build
```

The dev server defaults to `http://localhost:3000`.
