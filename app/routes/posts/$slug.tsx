import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import { getPost } from '~/models/post.server';

type LoaderData = {
  post: Awaited<ReturnType<typeof getPost>>
}

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params
  if (!slug) return

  const post = await getPost(slug)

  return json({ post })
}

export default function PostPage() {
  const { post } = useLoaderData() as LoaderData

  if (!post) return <>no post</>

  return (
    <main>
      <h1>{post.title}</h1>
    </main>
  )
}
