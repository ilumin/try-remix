import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import { getPostListings } from '~/models/post.server'

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>
}

export const loader: LoaderFunction = async () => {
  const posts = await getPostListings()
  return json<LoaderData>({ posts })
}


export default function PostsPage() {
  const { posts } = useLoaderData() as LoaderData

  return (
    <main>
      <h1>Posts</h1>
      <Link to="admin">
        Admin
      </Link>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
