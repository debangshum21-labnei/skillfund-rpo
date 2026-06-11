# TODO - Auth & Session Audit Fixes (Next.js + Supabase)

- [x] 1) Implement session-aware Navbar (client-side `getSession()` + `onAuthStateChange`) to fix Login/Start visibility.
- [x] 2) Fix LogoutButton to ensure UI updates immediately after logout (force refresh / re-check auth state).
- [x] 3) Extend middleware to also redirect authenticated users away from `/login` and `/register`, and optionally ensure `/register` is protected.

- [ ] 4) Run `npm run lint` and `npm run build` to ensure no auth-related build errors.
- [ ] 5) Provide verification steps for login/register/logout + route protection.

