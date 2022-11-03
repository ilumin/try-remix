import { Link } from '@remix-run/react'

export default function PostsPage() {
  const posts = [
    {
      slug: 'first-post',
      title: 'First Post',
    },
    {
      slug: 'trail-riding',
      title: 'Trail Riding with Onewheel',
    },
  ]

  return (
    <main>
      <h1>Posts</h1>
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
