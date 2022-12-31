import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  useParams,
  useTransition,
} from '@remix-run/react';
import JokeDetail from '~/components/joke';
import { db } from '~/utils/db.server';
import { getUserId } from '~/utils/session.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return {
      title: 'No Joke',
      description: 'No Joke Found',
    };
  }
  return {
    title: `${data.joke.name} Joke`,
    description: `Have fun with ${data.joke.name}`,
  };
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  if (!joke) {
    throw new Response('What a joke! Not found.', { status: 404 });
  }
  const userId = await getUserId(request);
  const isOwner = userId === joke.jokesterId;
  return json({ joke, isOwner });
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response('Not Authorized', { status: 401 });
  }
  const form = await request.formData();
  if (form.get('intent') !== 'delete') {
    throw new Response(`Intent ${form.get('itent')} is not supported`, {
      status: 400,
    });
  }
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  if (!joke) {
    throw new Response(`Joke ${params.jokeId} not found`, { status: 404 });
  }
  if (joke.jokesterId !== userId) {
    throw new Response('Nice try! This is not your joke', { status: 403 });
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect('/jokes');
};

export const ErrorBoundary = () => {
  const { jokeId } = useParams();
  return (
    <div className='error-container'>{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 400) {
    return (
      <div className='error-container'>What you are trying is not support</div>
    );
  }
  if (caught.status === 403) {
    return (
      <div className='error-container'>
        Sorry, but ${params.jokeId} is not your joke
      </div>
    );
  }
  if (caught.status === 404) {
    return (
      <div className='error-container'>
        Huh? What the heck is "{params.jokeId}"
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status} ${caught.statusText}`);
};

export default function JokeRoute() {
  const { joke, isOwner } = useLoaderData<typeof loader>();
  const transition = useTransition();
  return (
    <JokeDetail
      joke={joke}
      isOwner={isOwner}
      disabled={transition.state !== 'idle'}
    />
  );
}
