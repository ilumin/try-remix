import { Form, useActionData } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { createPost } from '~/models/post.server';

const inputClass = `w-full rounded border border-gray-500 px-2 py-2 font-mono`

type ActionData = {
  title: string | null
  slug: string | null
  markdown: string | null
} | undefined

export const action: ActionFunction = async ({ request }) => {
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

  await createPost({ title, slug, markdown })

  return redirect('/posts/admin')
}

export default function NewPostRoute() {
  const errors = useActionData() as ActionData

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <span className="text-red-600">{errors?.title}</span>}
          <input type="text" name="title" className={inputClass} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <span className="text-red-600">{errors?.slug}</span>}
          <input type="text" name="slug" className={inputClass} />
        </label>
      </p>
      <p>
        <label>
          Post markdown: {errors?.markdown && <span className="text-red-600">{errors?.markdown}</span>}
          <textarea name="markdown" id="markdown" cols={30} rows={20} className={inputClass} />
        </label>
      </p>
      <p>
        <button type="submit" className='rounded bg-blue-500 text-white py-2 px-4'>Create Post</button>
      </p>
    </Form>
  )
}
