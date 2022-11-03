import { marked } from 'marked';
import invariant from 'tiny-invariant';
import { getPost } from '~/models/post.server';

import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';

import type { LoaderFunction } from '@remix-run/server-runtime';

type LoaderData = {
  title: string
  html: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params
  invariant(slug, 'slug is required')

  const post = await getPost(slug)
  invariant(post, `post not found: ${slug}`)

  return json({
    title: post?.title,
    html: marked(post?.markdown),
  })
}

export default function PostPage() {
  const { title, html } = useLoaderData() as LoaderData

  return (
    <main>
      <h1>{title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
