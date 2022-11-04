import { Form } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

const inputClass = `w-full rounded border border-gray-500 px-2 py-2 font-mono`

export const action: ActionFunction = ({ request }) => {
  console.log('request:', request)

  return redirect('/posts/admin')
}

export default function NewPostRoute() {
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:
          <input type="text" name="title" className={inputClass} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          <input type="text" name="slug" className={inputClass} />
        </label>
      </p>
      <p>
        <label>
          Post markdown:
          <textarea name="markdown" id="markdown" cols={30} rows={20} className={inputClass} />
        </label>
      </p>
      <p>
        <button type="submit" className='rounded bg-blue-500 text-white py-2 px-4'>Create Post</button>
      </p>
    </Form>
  )
}
