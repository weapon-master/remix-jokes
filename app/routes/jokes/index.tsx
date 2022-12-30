import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const count = await db.joke.count();
  console.log(count);
  const ramdomNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: ramdomNumber,
  });
  if (!randomJoke) {
    throw new Response('No random joke found', { status: 404 });
  }
  return json({ randomJoke });
};

export function ErrorBoundary() {
  return <div className='error-container'>I did a whoopsies.</div>;
}

export const CatchBoundary = () => {
  const caught = useCatch();
  if (caught.status === 404) {
    return <div className='error-container'>There are no jokes to display</div>;
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status} ${caught.statusText}`,
  );
};
export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke?.content}</p>
    </div>
  );
}
