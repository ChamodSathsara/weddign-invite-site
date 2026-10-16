# RSVP backend & deployment

The invitation front end is complete. The RSVP form talks to a JSON API you host
(any serverless platform, e.g. Vercel Functions). Until `wedding.rsvp.endpoint`
in `data/wedding.ts` is set, the form runs in clearly labelled **preview mode**
and stores the response only on the guest's own device — nothing is faked or sent.

## 1. Environment variables (`.env.example`)

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/wedding?sslmode=require"
RSVP_DEADLINE="2026-12-01T23:59:59+05:30"
RSVP_DEADLINE_MODE="close"        # close | allowLate
RSVP_MAX_GUESTS="4"
RATE_LIMIT_PER_MINUTE="5"
ADMIN_EXPORT_SECRET="long-random-string"   # protects any CSV export you add
```

## 2. Prisma schema (`prisma/schema.prisma`)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Attendance { ACCEPT DECLINE }

model Guest {
  id          String   @id @default(cuid())
  displayName String   @db.VarChar(80)
  /// SHA-256 of the opaque token in the invite link — never store the raw token
  tokenHash   String   @unique @db.Char(64)
  maxGuests   Int      @default(4)
  createdAt   DateTime @default(now())
  rsvp        Rsvp?
}

model Rsvp {
  id             String     @id @default(cuid())
  guestId        String?    @unique
  guest          Guest?     @relation(fields: [guestId], references: [id], onDelete: Cascade)
  fullName       String     @db.VarChar(80)
  attending      Attendance
  guests         Int        /// 0 when declining
  idempotencyKey String     @unique @db.VarChar(64)
  ipHash         String     @db.Char(64)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  @@index([createdAt])
}
```

Run: `npx prisma migrate dev --name init` locally, `npx prisma migrate deploy` in CI.

## 3. API contract (`/api/rsvp`)

| Method | Body / query | Success | Errors |
| --- | --- | --- | --- |
| `GET` | `?token=…` | `200 { fullName, attending, guests, updatedAt }` | `404` none / bad token |
| `POST` | `{ fullName, attending: "accept"\|"decline", guests }` + `Idempotency-Key` header | `201` saved RSVP | `400/422` invalid · `403` closed · `429` rate limited |
| `PUT` | same + `token` | `200` updated RSVP | `401/404` bad token |

Server rules (mirror `utils/rsvpSchema.ts`):
- Validate with the same Zod schema; trim, NFC-normalise, max 80 chars.
- `decline` ⇒ force `guests = 0`; `accept` ⇒ `1 ≤ guests ≤ guest.maxGuests`.
- Hash incoming tokens (SHA-256) and look up `tokenHash`; tokens are 32 random bytes, base64url.
- Same `Idempotency-Key` ⇒ return the stored row, never insert twice.
- One RSVP per token (`guestId @unique`); untokened submissions are rate limited by hashed IP.
- Reject after the deadline when mode is `close`.
- Never expose a list endpoint publicly. Exports must require `ADMIN_EXPORT_SECRET`.

Generate invite links: `/invite?name=Mr.%20Jagath&token=<random>`. The name is display-only.

## 4. Deploy

1. Provision PostgreSQL (Neon, Supabase, Vercel Postgres).
2. Set the env vars above in your host.
3. Deploy the API, run `prisma migrate deploy`.
4. Set `wedding.rsvp.endpoint = '/api/rsvp'` and redeploy the front end.
5. Add server-rendered Open Graph tags (title, description, couple image) for link previews.
6. Upload a favicon via the Publish panel.

## Assets

- Couple illustration and intro film: hosted on the CDN URLs in `data/wedding.ts`.
- Gallery photos 2–4: placeholders — add files and set `src` in `data/gallery.ts`.
- Music: set `assets.music` to a licensed track; otherwise an original generated melody plays.
