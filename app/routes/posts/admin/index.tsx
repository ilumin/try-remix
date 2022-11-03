import { Link } from '@remix-run/react';

export default function AdminIndexRoute() {
  return (
    <p>
      <Link to="new">Create new post</Link>
    </p>
  )
}