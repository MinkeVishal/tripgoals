# TripGoals

Travel agency website: public catalogue (packages, categories, adventures), customer accounts with a wishlist, and an admin dashboard. Built with Next.js 16 (App Router), Tailwind CSS v4 and Appwrite.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

Environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project |
| `APPWRITE_API_KEY` | Server-only key. Never exposed to the browser |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (sitemap, metadata) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_INSTAGRAM_REEL_URL` | Contact / social links |

## Roles

Roles are Appwrite user **labels**. No label means Customer.

| Role | Can do |
|---|---|
| Customer | Wishlist, account (name, phone, password) |
| Editor (`editor`) | Admin panel: create and edit packages, adventures, categories. No delete, banners or users |
| Admin (`admin`) | Everything, including banners and users (change roles, delete) |

All writes go through server actions that check the role first. The browser never has write access to Appwrite.

Give someone a role:

```bash
npx tsx --env-file=.env scripts/grant-role.ts someone@example.com admin
```

## Scripts

- `npm run dev` / `build` / `start`: run the app
- `npm run lint`, `npm run typecheck`: checks
- `scripts/backup-appwrite.mjs`: exports the database to `appwrite/backup/` (gitignored)
- `scripts/migrate-v2.ts`: additive schema migration (`--apply` to run; safe to re-run, the old site keeps working)
- `scripts/cutover-v2.ts`: final step once v2 is live (`--apply`): seeds adventures and banners, locks table and bucket permissions to public read, removes the legacy `users` table
- `scripts/grant-role.ts <email> <admin|editor|customer>`

## Going live (order)

1. Back up, then run the migration.
2. Deploy to Vercel with the env vars above.
3. Run the cutover.
4. Sign up on the site, then grant yourself `admin` with `grant-role.ts`.
5. In the Appwrite console, set the password policy and the recovery URL to `<site>/reset-password`.

## Notes

- Old links `/package/:id` and `/category/:name` redirect (308) to the new slug URLs.
- Images are served from Appwrite and optimised by `next/image`.
- Next.js docs for this version ship in `node_modules/next/dist/docs/` (see `AGENTS.md`).
