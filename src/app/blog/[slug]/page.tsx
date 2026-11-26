import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/tables'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from(TABLES.posts)
    .select(`*, ${TABLES.businesses}(name, slug)`)
    .eq('id', slug)
    .single()
  if (!post) notFound()
  const postFull = post as unknown as Record<string, unknown> & {
    id: string
    title: string
    published_at: string
    cover: string
    body: string
    businesses: { name: string; slug: string } | null
  }
  const biz = postFull.businesses

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        {biz && (
          <Link className="text-sm font-semibold text-emerald-700 hover:underline" href={`/business/${biz.slug}`}>
            {biz.name}
          </Link>
        )}
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{postFull.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{new Date(postFull.published_at).toLocaleDateString()}</p>
      </div>
      {postFull.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={postFull.cover} alt={postFull.title} className="h-64 w-full rounded-xl object-cover" />
      )}
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: postFull.body }} />
    </article>
  )
}
