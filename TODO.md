# Theme professional pass - TODO

- [x] Inspect TradingView chart theme styling issues (replace hard-coded slate/hex with theme tokens)
- [x] Update `frontend/src/components/trading/tradingview-chart.tsx` to use `--bg-*` / `--text-*` / `--border-*` consistently (including fullscreen/loading states)
- [x] Update `frontend/src/components/trading/order-panel.tsx` for any remaining inconsistencies (CTA text color, hover/active polish)
- [x] Sanity-check other trading components if quick regressions appear (optional)
- [x] Run `frontend` build to ensure theme changes don't break compilation

- [x] Run `npm run lint` and `npm run build` in `frontend/`
- [ ] Manual verification: light/dark + fullscreen + loading spinner + hover/active


