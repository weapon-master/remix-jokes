import type { Joke } from '@prisma/client';
import { Form, Link } from '@remix-run/react';
import type { FC } from 'react';

interface Props {
  disabled: boolean;
  joke: Pick<Joke, 'content' | 'name'>;
  isOwner: boolean;
}

const JokeDetail: FC<Props> = ({ disabled, joke, isOwner }) => {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke?.content}</p>
      <Link to='.'>{joke?.name} Permalink</Link>
      {isOwner ? (
        <Form method='post'>
          <button
            className='button'
            disabled={disabled}
            name='intent'
            type='submit'
            value='delete'
          >
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
};

export default JokeDetail;
