import { SITE } from '@/lib/site.config'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="flex w-full flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} {SITE.name}. {SITE.footerTagline}</p>
        <div className="flex gap-4">
          <a href="/pricing" className="hover:text-slate-900">Business plans</a>
          <a href="/privacy" className="hover:text-slate-900">Privacy</a>
          <a href="/terms" className="hover:text-slate-900">Terms</a>
        </div>
      </div>
    </footer>
  )
}
