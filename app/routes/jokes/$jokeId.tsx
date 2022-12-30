import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  if (!joke) {
    throw new Response('What a joke! Not found.', { status: 404 });
  }
  return json({ joke });
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
  const { joke } = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke?.content}</p>
      <Link to='.'>{joke?.name} Permalink</Link>
    </div>
  );
}
