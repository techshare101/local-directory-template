import { SITE } from '@/lib/site.config'

/** Empty string when no sales number is configured — callers must hide the CTA. */
export function salesWhatsAppHref(message: string): string {
  const digits = SITE.salesWhatsApp.replace(/\D/g, '')
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function formatSalesWhatsApp(): string {
  const d = SITE.salesWhatsApp.replace(/\D/g, '')
  if (!d) return ''
  if (d.length === 11 && d.startsWith('1')) {
    return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
  }
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return `+${d}`
}
