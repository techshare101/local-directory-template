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
