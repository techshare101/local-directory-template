import Link from 'next/link'

export default function EventsDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/events" className="text-sm font-medium text-emerald-700 hover:underline">← Back to events</Link>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Event</h1>
        <p className="mt-1 text-slate-500">Select an event from the calendar to see details.</p>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
        <p>Return to the events list and click an event card to view its full details.</p>
        <Link href="/events" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline">
          View all events →
        </Link>
      </div>
    </div>
  )
}
