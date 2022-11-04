import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { createPost, updatePost, getPost } from '~/models/post.server';
import { requireAdminUser } from '~/session.server';

const inputClass = `w-full rounded border border-gray-500 px-2 py-2 font-mono`

type ActionData = {
  title: string | null
  slug: string | null
  markdown: string | null
} | undefined

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request)

  if (!params?.slug || params?.slug === 'new') return json({})

  const post = await getPost(params.slug)
  return json({ post })
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireAdminUser(request)
  invariant(params?.slug, 'slug is required')

  const { title, slug, markdown } = Object.fromEntries(await request.formData())

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
  const data = useLoaderData()
  const errors = useActionData() as ActionData
  const transition = useTransition()

  const isSubmitting = Boolean(transition.submission?.formData.get('intent') === 'create')
  const isUpdating = Boolean(transition.submission?.formData.get('intent') === 'update')
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
      <p>
        <button
          type="submit"
          name="intent"
          value={isNewPost ? 'create' : 'update'}
          className='rounded bg-blue-500 text-white py-2 px-4'
          disabled={isSubmitting}>
          {isNewPost && (isSubmitting ? 'Creating ...' : 'Create Post')}
          {!isNewPost && (isUpdating ? 'Updating ...' : 'Update Post')}
        </button>
      </p>
    </Form>
  )
}
