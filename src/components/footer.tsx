import { SITE } from '@/lib/site.config'
import { formatSalesWhatsApp, salesWhatsAppHref } from '@/lib/sales-contact'

export function Footer() {
  const wa = salesWhatsAppHref(`Hola, vi ${SITE.name} y quiero saber más.`)
  const waLabel = formatSalesWhatsApp()

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="flex w-full flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} {SITE.name}. {SITE.footerTagline}</p>
        <div className="flex flex-wrap items-center gap-4">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              WhatsApp {waLabel}
            </a>
          )}
          <a href="/feature" className="hover:text-slate-900">Get featured</a>
          <a href="/add-business" className="hover:text-slate-900">Add a business</a>
          <a href="/privacy" className="hover:text-slate-900">Privacy</a>
          <a href="/terms" className="hover:text-slate-900">Terms</a>
        </div>
      </div>
    </footer>
  )
}
