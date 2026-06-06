# SkillFund Deployment

The deployable app lives in `frontend/`.

## Vercel Settings

- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave blank
- Node.js Version: `22.x`

## If Vercel Shows `404: NOT_FOUND`

This usually means the deployment URL does not point to a valid deployment, or Vercel
is not deploying the `frontend` directory.

Check these in order:

1. Confirm the latest local changes are committed and pushed to the GitHub branch Vercel uses.
2. In Vercel project settings, confirm Root Directory is exactly `frontend`.
3. Trigger a fresh redeploy from Vercel after saving the root directory setting.
4. Open the newest deployment URL from the Vercel deployments tab.
5. If using a custom domain, confirm it is assigned to this project and points to the latest production deployment.

Local verification:

```sh
npm --prefix frontend install
npm --prefix frontend run build
```
