import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, Link, useActionData, useCatch } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/request.server';
import { getUserId, requireUserId } from '~/utils/session.server';

const validateJokeName = (name: string) => {
  if (name.length < 3) {
    return 'This joke name is too short';
  }
};

const validateJokeContent = (content: string) => {
  if (content.length < 10) {
    return 'This joke is too short';
  }
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const jokesterId = await requireUserId(request, '/jokes/new');
  const formData = await request.formData();
  const name = formData.get('name');
  const content = formData.get('content');
  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly',
    });
  }
  const fields = { name, content };
  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }
  const joke = await db.joke.create({ data: { name, content, jokesterId } });
  return redirect(`/jokes/${joke.id}`);
};

export function ErrorBoundary() {
  return (
    <div className='error-container'>
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}

export const CatchBoundary = () => {
  const caught = useCatch();
  if (caught.status === 401) {
    return (
      <div className='error-container'>
        <p>You must be logged in to create a joke</p>
        <Link to={`/login?redirectTo=${encodeURIComponent('/jokes/new')}`}>
          Login
        </Link>
      </div>
    );
  }
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method='post'>
        <div>
          <label>
            Name:{' '}
            <input
              type='text'
              defaultValue={actionData?.fields?.name}
              name='name'
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className='form-validation-error' role='alert' id='name'>
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              name='content'
              defaultValue={actionData?.fields?.content}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className='form-validation-error'
              role='alert'
              id='content-error'
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className='form-validation-error' role='alert'>
              {actionData.formError}
            </p>
          ) : null}
        </div>
        <div>
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}
