import { Link } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { requireAdminUser } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request)
  return json({})
}

export default function AdminIndexRoute() {
  return (
    <p>
      <Link to="new">Create new post</Link>
    </p>
  )
}