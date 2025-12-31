# AI Second Brain

A modern “second brain” app built with Next.js (App Router) where users can manage:

- Notes (TipTap JSON)
- Canvas documents (tldraw JSON)
- Media uploads (stored in Supabase Storage)

Auth + billing is powered by Clerk. The UI uses shadcn-style components with light/dark mode.

## Live demo

- **Production**: [ai-second-brain-five.vercel.app](https://ai-second-brain-five.vercel.app/)

## Tech stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui
- **Auth & Billing**: Clerk (+ `@clerk/themes` shadcn theme)
- **Database**: PostgreSQL + Prisma
- **Storage**: Supabase Storage (admin client via service role key)

## Technical decisions (why these tools)

- **Next.js App Router**: server components + server actions let us keep most data fetching and enforcement on the server, while still having a fast client UX.
- **PostgreSQL + Prisma**: strong relational model for profiles/notes/canvases/media, type-safe queries, and migrations.
- **Clerk (Auth + Billing)**: handles identity, protected routes, and subscriptions/entitlements so plan gating stays consistent.
- **Supabase Storage**: simple object storage for user uploads, with server-side service role access for uploads/deletes.
- **shadcn/ui + Tailwind + `next-themes`**: consistent design system with a clean light/dark toggle across the whole app.

## How key features are implemented

- **Authentication & authorization**

  - Clerk provides the signed-in user, and all DB queries are scoped by the current user’s `UserProfile` to prevent cross-user access.

- **Billing & limits**

  - Central config lives in `lib/billing/config.ts`.
  - Server-only entitlements normalization happens in `lib/billing/entitlements.ts`.
  - The client uses `hooks/use-billing.ts` to fetch entitlements/usage and keep UI gating fresh after upgrades.
  - Create actions enforce limits server-side (notes/canvas/media) so users can’t bypass gating from the client.

- **Notes**

  - Notes are stored as **TipTap JSON** in the database for long-term reuse.

- **Canvas**

  - Canvases are stored as **tldraw JSON** in the database.

- **Media uploads**

  - Uploads go to Supabase Storage using a server-only admin client (`lib/supabase-admin.ts`), then the public URL + metadata are stored in Postgres.

- **Bulk selection + delete**

  - Notes/Canvas/Media/Home feed use checkbox multi-select and a shared `SelectionActionBar` with an `AlertDialog` confirmation before deleting.

- **Dark mode (including Clerk UI)**
  - App theme is controlled by `next-themes` and toggles the `.dark` class on the document.
  - Clerk UI uses the official `@clerk/themes` **shadcn** theme so it automatically adapts to light/dark:
    - See Clerk Themes docs: [Clerk appearance themes](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/themes)

## Running locally

### Prerequisites

- **Node.js**: latest LTS recommended
- **PostgreSQL**: local install or Docker
- **Clerk**: a Clerk application (publishable + secret keys)
- **Supabase**: a Supabase project (URL + service role key) and a storage bucket

### 1) Install dependencies

```bash
npm install
```

### 2) Create your env file

Create a `.env.local` in the project root.

You can start from the template in `env.example`:

```bash
cp env.example .env.local
```

Then fill in values (details below).

### 3) Set up the database

1. Create a Postgres database (e.g. `ai_second_brain`).
2. Set `DATABASE_URL` in `.env.local`.
3. Run migrations:

```bash
npx prisma migrate dev
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

All variables below go in `.env.local` (local dev) or your hosting provider’s env settings (prod).

### Required

#### Database (Prisma + Postgres)

- **`DATABASE_URL`**: Postgres connection string used by Prisma.
  - Example: `postgresql://postgres:postgres@localhost:5432/ai_second_brain`

#### Clerk (Auth)

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: Clerk publishable key (client-safe)
- **`CLERK_SECRET_KEY`**: Clerk secret key (server-only)

#### Clerk Billing (Pro checkout)

- **`NEXT_PUBLIC_CLERK_PRO_PLAN_ID`**: Clerk “Pro” plan ID used for checkout.
  - Used by our billing config in `lib/billing/config.ts`.

#### Supabase (media uploads)

Used by the server to upload/delete files from Supabase Storage.

- **`SUPABASE_URL`** (recommended) or **`NEXT_PUBLIC_SUPABASE_URL`**
- **`SUPABASE_SERVICE_ROLE_KEY`**: server-only key (keep secret!)
- **`SUPABASE_STORAGE_BUCKET`** (optional): defaults to `media`

### Optional

#### OpenRouter (legacy API route)

The repo still contains `app/api/chat/route.ts` (OpenRouter chat completion). The UI is currently “AI Chat coming soon”, so this route is not part of the MVP UX, but you can enable it if you want:

- **`OPENROUTER_API_KEY`**: required if you call `/api/chat`
- **`OPENROUTER_MODEL`** (optional)
- **`OPENROUTER_SITE_URL`** (optional)
- **`OPENROUTER_APP_NAME`** (optional)

## Useful commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Start production**: `npm run start`
- **Lint**: `npm run lint`
- **DB Studio**: `npx prisma studio`

## Notes on theming (dark mode + Clerk)

This app uses `next-themes` for light/dark mode. Clerk components follow the same toggle by using the official Clerk theme system and the shadcn theme (see: [Clerk appearance themes](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/themes)).

---

## Krav (checklist)

### Godkänt (G)

#### Planering och Research

- [x] Utföra en noggrann målgruppsanalys.
- [x] Använda ett projekthanteringsverktyg för backlog (Linear/Trello/Jira/GitHub Projects el. liknande).

#### Design och Prototyping

- [x] Skapa wireframes och prototyp i Figma som följer UX/UI-principer.
- [x] Designen är responsiv för minst två olika skärmstorlekar och följer WCAG 2.1-standarder.

#### Applikationsutveckling

- [x] Utveckla med ett modernt JavaScript-ramverk. (Next.js / React)
- [x] Använd en databas för lagring och hämtning av data. (PostgreSQL + Prisma)
- [x] Implementera state-hantering och skapa dynamiska komponenter med reaktivitet och interaktivitet. (React state/hooks)
- [x] Följa WCAG 2.1-standarder och använda semantisk HTML.
- [x] För webbapp: Produkten är responsiv och fungerar korrekt på minst två skärmstorlekar (mobil + dator).
- [x] README-fil med info om hur projektet körs + env-setup. (denna README + `env.example`)
- [x] README innehåller publik länk.
- [x] README innehåller checklista med betygskriterier ni uppfyllt.

#### Versionshantering

- [x] Arbeta med Git och ha ett repo på GitHub.

#### Slutrapport (2–3 sidor)

- [x] Abstract på engelska.
- [x] Tech stack och motivering av valen.
- [x] Dokumentation av arbetsprocess, planering och research.

#### Deploy

- [x] Projektet är hostat och publikt tillgängligt (webbläsare/simulator).

#### Helhetsupplevelsen

- [ ] Fri från tekniska fel (döda länkar/kraschande sidor), konsekvent design och obruten navigation.

### Väl godkänd (VG)

- [x] Allt för Godkänt (G)

#### Design och prototyping

- [ ] Implementera interaktivitet i prototypen som demonstrerar användarflöden.
- [ ] Prototypen är väldigt lik den färdiga produkten.
- [ ] Designen följer, utan undantag, WCAG 2.1 nivå A och AA.

#### Applikationsutveckling

- [x] Använd en state management-lösning (t.ex. Redux/Pinia) för global state.
- [ ] Koden följer, utan undantag, WCAG 2.1 nivå A och AA.
- [ ] Testad i WebAIM WAVE utan fel på error- och varnings-nivåer.
- [x] Optimering: återanvänder kod/komponenter och använder optimeringstekniker där det behövs.
- [x] Implementera CRUD (Create/Read/Update/Delete) med säker hantering av användardata.
- [x] Implementera en säker autentiseringslösning för databasen (endast behöriga får åtkomst). (Clerk auth + per-user queries)
- [x] För webbapp: fullt responsiv från mobil till större skärmar med optimal UX.
- [x] Tydlig README som förklarar tekniska val och hur funktioner implementerats.

#### Versionshantering

- [x] Feature branches + pull requests innan merge till baskod.
- [x] Tydliga, informativa commit-meddelanden.

#### Deploy

- [x] Automatiserat flöde för bygge och deploy (CI/CD).

#### Slutrapport (3–6 A4)

- [x] Djupgående analys: arbetsprocess, utmaningar, lärdomar.
- [x] Motivera verktyg/tekniker (t.ex. React vs Vue).
- [x] Motivera UX/UI och tillgänglighet och hur det förbättrat upplevelsen.

#### Helhetsupplevelsen

- [x] Professionell och optimerad UX: minimala laddningstider, tydlig feedback, testad på flera enheter/webbläsare.
