# Automatic WhatsApp delivery of owner dashboard links

When an operator approves a claim, the server mints a 90-day owner token and
tries to deliver `/owner/<token>` to the owner's WhatsApp. Delivery is
provider-agnostic and selected by environment variables — no code change.

## Option A — Meta WhatsApp Cloud API (official)

Requirements: a Meta business portfolio, a WhatsApp Business phone number, and
a permanent system-user token.

```env
WHATSAPP_TOKEN=EAAG...            # permanent token, never commit
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_TEMPLATE_NAME=owner_dashboard_link   # optional, see note
WHATSAPP_TEMPLATE_LANG=es
WHATSAPP_API_VERSION=v21.0
```

**Template note (important).** WhatsApp only allows free-form text within 24h of
the owner's last message to your number. Business-initiated messages outside
that window must use a pre-approved template. Create a Utility template whose
body takes exactly two parameters:

```
Hola {{1}}, tu ficha ya está activa. Edita tus datos, horario y fotos aquí: {{2}}
```

`{{1}}` = business name, `{{2}}` = owner dashboard URL. Once approved, set
`WHATSAPP_TEMPLATE_NAME` to its name. Without a template name the code sends
free-form text (fine for testing while the owner is chatting with you).

## Option B — Generic webhook (n8n, Twilio proxy, Baileys bridge, …)

```env
WHATSAPP_WEBHOOK_URL=https://your-sender.example.com/send
```

The server POSTs JSON:

```json
{ "to": "18095551234", "message": "Hola 👋 …", "url": "https://…/owner/own_…", "business": "Colmado Junior" }
```

Any 2xx response counts as delivered. Use this when you already run a sender
(n8n workflow, Twilio function, self-hosted Baileys service).

## Option C — Self-hosted sender on Railway (no business account, no Meta approval)

A small Baileys service links your own WhatsApp as a device (QR once) and exposes
`POST /send`. Verified deployment:

- Code: `C:/Users/valen/Development/wa-sender2` (`sender.mjs`, Express + Baileys rc14)
- Host: Railway service `isla-wa-sender`, public URL `https://isla-wa-sender-production.up.railway.app`
- Session: Railway volume `isla-wa-sender-volume` mounted `/data`, `WA_AUTH_DIR=/data/auth/auth`
- Secret: `WA_SENDER_SECRET` on Railway **and** `WHATSAPP_WEBHOOK_SECRET` on Vercel —
  requests without `x-webhook-secret` get 401.

```env
WHATSAPP_WEBHOOK_URL=https://isla-wa-sender-production.up.railway.app/send
WHATSAPP_WEBHOOK_SECRET=<shared secret>
```

Operational notes:

- The sender binds `0.0.0.0:$PORT` on Railway (Railway injects `PORT`); locally it
  binds `127.0.0.1:3011`.
- `GET /health` → `{connected, me}`. If `connected:false`, the session died
  (phone logged out the device) and a fresh QR is required.
- `POST /bootstrap {files:{...}}` seeds the auth dir on a new volume, then exits so
  the platform restarts with the session loaded.
- Moving the session: `railway volume files -v <volume-id> upload auth /auth`.
  A deployment must exist first — uploads fail with "no active deployment".
- Keep exactly one process connected per session; two clients on the same
  `creds.json` fight and get disconnected.
- Cloudflare quick tunnels (`trycloudflare.com`) and `localhost.run` both returned
  404/502 for this origin — don't spend time there; host the process instead.

## Behaviour without credentials

`sendOwnerLink()` returns `{ sent: false, detail: "WhatsApp is not configured" }`.
The approve endpoint still succeeds — the admin UI shows an amber
"WhatsApp not sent" notice next to the copy-link box, so the manual path keeps
working. Nothing fails closed.

## Phone normalisation

Dominican 10-digit numbers starting 809/829/849 are prefixed with `1`
(E.164). Numbers already in international form are stripped to digits.

## Verifying

1. Submit a claim at `/claim` with a real WhatsApp number.
2. Approve at `/admin/claims`.
3. Expect a green "✓ WhatsApp sent" notice, or an amber notice with the reason.
4. The owner receives the link and can edit profile, hours and photos.
