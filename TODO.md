# Theme professional pass - TODO

- [ ] Inspect TradingView chart theme styling issues (replace hard-coded slate/hex with theme tokens)
- [ ] Update `frontend/src/components/trading/tradingview-chart.tsx` to use `--bg-*` / `--text-*` / `--border-*` consistently (including fullscreen/loading states)
- [ ] Update `frontend/src/components/trading/order-panel.tsx` for any remaining inconsistencies (CTA text color, hover/active polish)
- [ ] Sanity-check other trading components if quick regressions appear (optional)
- [x] Run `frontend` build to ensure theme changes don’t break compilation

- [x] Run `npm run lint` and `npm run build` in `frontend/`
- [ ] Manual verification: light/dark + fullscreen + loading spinner + hover/active


