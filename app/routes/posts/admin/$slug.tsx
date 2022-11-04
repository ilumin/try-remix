import { Form, useActionData, useCatch, useLoaderData, useParams, useTransition } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import type { Post } from '~/models/post.server';
import { createPost, updatePost, getPost, deletePost } from '~/models/post.server';
import { requireAdminUser } from '~/session.server';

const inputClass = `w-full rounded border border-gray-500 px-2 py-2 font-mono`

type LoaderData = {
  post?: Post
}

type ActionData = {
  title: string | null
  slug: string | null
  markdown: string | null
} | undefined

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request)

  if (!params?.slug || params?.slug === 'new') return json<LoaderData>({})

  const post = await getPost(params.slug)
  if (!post) {
    throw new Response('Not Found', { status: 404 })
  }

  return json<LoaderData>({ post })
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireAdminUser(request)
  invariant(params?.slug, 'slug is required')

  const { title, slug, markdown, intent } = Object.fromEntries(await request.formData())

  if (intent === 'delete') {
    await deletePost(params?.slug)
    return redirect('/posts/admin')
  }

  const errors: ActionData = {
    title: title ? null : 'title is required',
    slug: slug ? null : 'slug is required',
    markdown: markdown ? null : 'markdown is required',
  }
  const hasErrors = Object.values(errors).filter(i => i !== null).length > 0
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof title === 'string', 'title must be string')
  invariant(typeof slug === 'string', 'slug must be string')
  invariant(typeof markdown === 'string', 'markdown must be string')

  if (params?.slug === 'new') {
    await createPost({ title, slug, markdown })
  } else {
    await updatePost(params?.slug, { title, slug, markdown })
  }

  return redirect('/posts/admin')
}

export default function NewPostRoute() {
  const data = useLoaderData() as LoaderData
  const errors = useActionData() as ActionData
  const transition = useTransition()

  const isSubmitting = Boolean(transition.submission?.formData.get('intent') === 'create')
  const isUpdating = Boolean(transition.submission?.formData.get('intent') === 'update')
  const isDeleting = Boolean(transition.submission?.formData.get('intent') === 'delete')
  const isNewPost = !data.post

  return (
    <Form method="post" key={data.post?.slug || 'new'}>
      <p>
        <label>
          Post Title: {errors?.title && <span className="text-red-600">{errors?.title}</span>}
          <input type="text" name="title" className={inputClass} defaultValue={data.post?.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <span className="text-red-600">{errors?.slug}</span>}
          <input type="text" name="slug" className={inputClass} defaultValue={data.post?.slug} />
        </label>
      </p>
      <p>
        <label>
          Post markdown: {errors?.markdown && <span className="text-red-600">{errors?.markdown}</span>}
          <textarea name="markdown" id="markdown" cols={30} rows={20} className={inputClass} defaultValue={data.post?.markdown} />
        </label>
      </p>
      <div className='flex justify-end gap-4'>
        {!isNewPost && (
          <button
            className='rounded bg-red-500 text-white py-2 px-4'
            name="intent"
            value="delete"
          >
            {isDeleting ? 'Deleting ...' : 'Delete'}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value={isNewPost ? 'create' : 'update'}
          className='rounded bg-blue-500 text-white py-2 px-4'
          disabled={isSubmitting}>
          {isNewPost && (isSubmitting ? 'Creating ...' : 'Create Post')}
          {!isNewPost && (isUpdating ? 'Updating ...' : 'Update Post')}
        </button>
      </div>
    </Form>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  const params = useParams()

  if (caught.status === 404) {
    return <>Not found: {params?.slug}</>
  }

  throw new Error("unsupported error");
}
