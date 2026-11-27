// Owner-link delivery over WhatsApp.
//
// Two providers, chosen by env — no code change to switch:
//
//   1. Meta WhatsApp Cloud API (official, needs a business number):
//        WHATSAPP_TOKEN=EAAG...
//        WHATSAPP_PHONE_NUMBER_ID=1234567890
//        WHATSAPP_TEMPLATE_NAME=owner_dashboard_link   (optional)
//        WHATSAPP_TEMPLATE_LANG=es                     (default es)
//      Business-initiated messages outside a 24h customer window REQUIRE a
//      pre-approved template. Template body must take exactly two parameters:
//        {{1}} = business name, {{2}} = owner dashboard URL
//      Without a template name we send free-form text (works only if the owner
//      messaged the business number in the last 24 hours).
//
//   2. Generic webhook (n8n, Twilio proxy, Baileys bridge, ...):
//        WHATSAPP_WEBHOOK_URL=https://...   POSTs {to, message, url, business}
//
// With neither configured the call returns sent:false / reason "not_configured"
// and the admin UI falls back to the copy-link box.

export interface WhatsAppResult {
  sent: boolean
  channel: 'cloud_api' | 'webhook' | 'none'
  detail: string
}

/** Normalise a Dominican/local number to E.164 digits (no plus). */
export function normalizePhone(raw: string): string {
  let d = String(raw || '').replace(/[^\d]/g, '')
  if (!d) return ''
  if (d.startsWith('00')) d = d.slice(2)
  // Local DR numbers: 10 digits starting 809/829/849 -> +1
  if (d.length === 10 && /^(809|829|849)/.test(d)) d = '1' + d
  // 7-digit local -> assume 809? leave as-is (invalid for WhatsApp)
  return d
}

export async function sendOwnerLink(opts: {
  to: string
  businessName: string
  url: string
}): Promise<WhatsAppResult> {
  const to = normalizePhone(opts.to)
  if (!to || to.length < 10) {
    return { sent: false, channel: 'none', detail: 'Owner phone number is missing or invalid' }
  }

  const message =
    `Hola 👋 Tu ficha de ${opts.businessName} en Villa Isabela Directory ya está activa.\n\n` +
    `Edita tus datos, horario y fotos aquí:\n${opts.url}\n\n` +
    `Este enlace es privado y vence en 90 días.`

  const webhook = process.env.WHATSAPP_WEBHOOK_URL
  if (webhook) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      // Optional shared secret so the sender can reject spoofed calls.
      if (process.env.WHATSAPP_WEBHOOK_SECRET) {
        headers['x-webhook-secret'] = process.env.WHATSAPP_WEBHOOK_SECRET
      }
      const res = await fetch(webhook, {
        method: 'POST',
        headers,
        body: JSON.stringify({ to, message, url: opts.url, business: opts.businessName }),
      })
      if (!res.ok) return { sent: false, channel: 'webhook', detail: `Webhook returned ${res.status}` }
      return { sent: true, channel: 'webhook', detail: `Sent via webhook to +${to}` }
    } catch (e) {
      return { sent: false, channel: 'webhook', detail: e instanceof Error ? e.message : 'Webhook failed' }
    }
  }

  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneId) {
    return { sent: false, channel: 'none', detail: 'WhatsApp is not configured' }
  }

  const version = process.env.WHATSAPP_API_VERSION || 'v21.0'
  const template = process.env.WHATSAPP_TEMPLATE_NAME
  const lang = process.env.WHATSAPP_TEMPLATE_LANG || 'es'

  const payload = template
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: { code: lang },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: opts.businessName },
                { type: 'text', text: opts.url },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { preview_url: true, body: message },
      }

  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = data?.error?.message || `Graph API returned ${res.status}`
      return { sent: false, channel: 'cloud_api', detail: err }
    }
    return { sent: true, channel: 'cloud_api', detail: `Sent to +${to}` }
  } catch (e) {
    return { sent: false, channel: 'cloud_api', detail: e instanceof Error ? e.message : 'Send failed' }
  }
}
