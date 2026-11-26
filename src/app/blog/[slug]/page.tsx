import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*, businesses(name, slug)')
    .eq('id', slug)
    .single()
  if (!post) notFound()
  const biz = (post as any).businesses

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        {biz && (
          <Link className="text-sm font-semibold text-emerald-700 hover:underline" href={`/business/${biz.slug}`}>
            {biz.name}
          </Link>
        )}
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
      </div>
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt={post.title} className="h-64 w-full rounded-xl object-cover" />
      )}
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  )
}
