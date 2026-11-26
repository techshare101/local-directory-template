export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© 2026 Villa Isabela Directory. Supporting local business on the Dominican north coast.</p>
        <div className="flex gap-4">
          <a href="/pricing" className="hover:text-slate-900">Business plans</a>
          <a href="/privacy" className="hover:text-slate-900">Privacy</a>
          <a href="/terms" className="hover:text-slate-900">Terms</a>
        </div>
      </div>
    </footer>
  )
}
