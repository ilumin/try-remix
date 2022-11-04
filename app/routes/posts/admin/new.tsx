import { Form, useActionData } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { createPost } from '~/models/post.server';

const inputClass = `w-full rounded border border-gray-500 px-2 py-2 font-mono`

export const action: ActionFunction = async ({ request }) => {
  const data = Object.fromEntries(await request.formData())

  const errors = {
    title: data?.title ? null : 'title is required',
    slug: data?.slug ? null : 'slug is required',
    markdown: data?.markdown ? null : 'markdown is required',
  }
  const hasErrors = Object.values(errors).length > 0
  if (hasErrors) {
    return json(errors)
  }

  await createPost(data)

  return redirect('/posts/admin')
}

export default function NewPostRoute() {
  const errors = useActionData()

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
