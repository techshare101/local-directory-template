import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/tables'

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from(TABLES.posts)
    .select(`*, ${TABLES.businesses}(name)`)
    .order('published_at', { ascending: false })
  const list = (posts ?? []) as unknown as (Record<string, unknown> & {
    id: string
    title: string
    excerpt: string
    cover: string
    published_at: string
    businesses: { name: string } | null
  })[]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Local spotlight</h1>
        <p className="mt-1 text-slate-500">News, tips and stories from local businesses.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} href={`/blog/${p.id}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-emerald-500">
            {p.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover} alt={p.title} className="h-40 w-full object-cover" />
            )}
            <div className="p-4">
              <div className="text-xs text-slate-500">
                {new Date(p.published_at).toLocaleDateString()} · {(p as any).businesses?.name || 'Local'}
              </div>
              <h2 className="mt-1 font-semibold text-slate-900">{p.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
