import { marked } from 'marked';
import { getPost } from '~/models/post.server';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import type { LoaderFunction } from '@remix-run/server-runtime';

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params
  if (!slug) return

  const post = await getPost(slug)
  const html = marked(post?.markdown)

  return json({ title: post?.title, html })
}

export default function PostPage() {
  const { title, html } = useLoaderData()

  return (
    <main>
      <h1>{title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
