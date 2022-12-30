import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link, useActionData, useSearchParams } from '@remix-run/react';

import stylesUrl from '~/styles/login.css';
import { badRequest } from '~/utils/request.server';
import { createUserSession, login } from '~/utils/session.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
];

const validateUsername = (username: string) => {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 2 characters long';
  }
};

const validatePassword = (password: string) => {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
};

const validateUrl = (url: string) => {
  const urls = ['/jokes', '/', 'https://remix.run'];
  if (urls.includes(url)) {
    return url;
  }
  return '/jokes';
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');
  const loginType = formData.get('loginType');
  const redirectTo = formData.get('redirectTo');
  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly',
    });
  }
  const finalRedirectTo = validateUrl(redirectTo || '/jokes');
  const fields = { username, password, loginType };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }
  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: 'Username Password combination is incorrect',
        });
      }
      return createUserSession(user.id, redirectTo);
    }
  }
  return redirect(finalRedirectTo);
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  return (
    <div className='container'>
      <div className='content' data-light=''>
        <h1>Login</h1>
        <form method='post'>
          <input
            type='hidden'
            name='redirectTo'
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <fieldset>
            <legend className='sr-only'>Login or Register?</legend>
            <label>
              <input
                type='radio'
                name='loginType'
                value='login'
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData.fields.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label>
              <input
                type='radio'
                name='loginType'
                value='register'
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor='username-input'>Username</label>
            <input
              type='text'
              id='username-input'
              name='username'
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? 'username-error' : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className='form-validation-error'
                role='alert'
                id='username-error'
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor='password-input'>Password</label>
            <input
              id='password-input'
              name='password'
              type='password'
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={actionData?.fieldErrors?.password}
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className='form-validation-error'
                role='alert'
                id='username-error'
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id='form-error-message'>
            {actionData?.formError ? (
              <p className='form-validation-error' role='alert'>
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type='submit' className='button'>
            Submit
          </button>
        </form>
      </div>
      <div className='links'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/jokes'>Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
