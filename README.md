# White-Label Local Directory — reusable template (any city, any vertical)

A clone-ready, white-label local business directory built with **Next.js 16 +
Supabase**. Ship it for any city (Villa Isabela, Miami...) or any vertical
(med-spas, restaurants, clinics, dentists, real estate...). One instance = one
directory that reads and writes its own prefixed tables, so many verticals can
co-exist in a single Supabase project (or one per project).

Built to match the layout and feel of leading niche directories (hero stats,
category grid, "fresh" listings, search, category pages, per-business pages
with offers, enquiries, events and a blog/spotlight), without the heavy
directory SaaS cost.

---

## Toolbox

| Feature | Where |
|---|---|
| Full-width hero + live stats | `/` |
| Browse by category (12 default, config-driven) | `/categories`, `/category/[slug]` |
| Search + location filter | `/search` |
| Per-business profile: services, offers, contact | `/business/[slug]` |
| Consent-gated enquiry form (leads into your DB) | enquiry-form component |
| Add-a-business form (submissions into your DB) | `/add-business` (form `/new`) |
| Local spotlight blog | `/blog`, `/blog/[slug]` |
| Events listing | `/events` |
| Pricing / Privacy / Terms pages | staged for monetization |
| RLS on every table; anon can read listed data + insert honest leads | migrations |

**White-label.** All copy, brand, city, hero image and the **table prefix** live
in **one file** — `src/lib/site.config.ts`. Point it at a new Supabase project's
env and redeploy for a whole new directory.

---

## Spin up a NEW vertical or city (5 steps)

1. **Clone / fork this repo.** Create a new Git repo, or branch this one.

2. **Edit `src/lib/site.config.ts`** — the ONLY file you need for rebranding:
   set `shortName`, `name`, `city`, `country`, `region`, `tagline`, headline,
   hero image, and critically **`tablePrefix`** (e.g. `medspa_`, `dental_`,
   `restaurants_`). Every table the app touches is `<tablePrefix><table>`.

   > Override at deploy time without editing code by setting
   > `NEXT_PUBLIC_DIRECTORY_TABLE_PREFIX=medspa_` in your Vercel/Supabase env.

3. **Apply the schema with YOUR prefix.** Copy
   `supabase/migrations/0001_core_schema.sql`, replace every `isabela_` with
   your prefix, and run it against your Supabase project (SQL editor or
   `supabase db execute`). Then seed — see the example at
   `supabase/seeds/medspa_miami_example.sql` (find/replace its `medspa_` too).

4. **Set env vars** (project-level, NOT just deploy flags — see pitfall below):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=        # https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=   # anon (publishable) key
   NEXT_PUBLIC_SITE_URL=            # your domain
   ```
   Add them in the Vercel dashboard (Settings -> Environment Variables) or
   non-interactively with the CLI, then deploy.

5. **Deploy**:
   ```bash
   npx vercel --prod --force
   ```

---

## Deploy pitfall that WILL bite you (learned the hard way)

**Piping `echo "KEY=value"` into `vercel env add` stores the literal
`KEY=value\n` (including the prefix and newline) as the VALUE.** The deployed
function then gets a garbage URL / rejected anon key → DB-backed routes 500
while static routes (which ignore env) return 200. Verify with
`npx vercel env pull` that values are clean.

```bash
# WRONG — stores "KEY=value" as the value
echo "NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# RIGHT — bare value only
printf '%s' "https://xyz.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

After adding/removing vars, **redeploy `--force`** so a stale build cache can't
pin the old env.

---

## Project structure

```
src/
  app/                  # App Router pages (all routes dynamic => fresh data)
  components/           # header, footer, cards, forms
  lib/
    site.config.ts      # THE white-label config (brand + copy + tablePrefix)
    tables.ts           # tb('categories') -> `${prefix}categories`, server+client safe
    data.ts             # all reads (uses TABLES.*)
    supabase/           # server + client clients
supabase/
  migrations/           # 0001 core schema . 0002 villa-isabela seed
  seeds/                # example vertical seeds (med-spa Miami)
```

Branch workflow: never commit to `main` — work on `dev`, open a PR.

---

## Live reference instance

The default branch is deployed and populated for Villa Isabela, DR:
**https://local-directory-mvp.vercel.app** — use it as the visual reference for
the template's behaviour before you rebrand a new vertical.

---

## Suggested monetization next steps (deferred by design)

- **Owner claim flow** + verification (per-table `claimed` flag already exists).
- **Stripe checkout** for the Featured tier (`/pricing` already has the tiers).
- **Owner dashboard** listing leads from their `enquiries`.
- **Per-vertical hooks** for the AgentReady *Signal Map* / *SchemaForge* stack:
  wire each listing to a JSON-LD `MedicalBusiness` (or `LocalBusiness`) schema
  for AI-discovery — the exact wedge MetalMindTech sells to med-spa owners
  (SchemaForge, AI SEO, local AI visibility).

*White-label build by MetalMindTech Labs — an AgentReady enabler.*
