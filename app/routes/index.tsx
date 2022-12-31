import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import stylesUrl from '~/styles/index.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
];

export const meta: MetaFunction = () => ({
  title: 'Rmix Root',
  description: 'Remix Joke App',
});

export default function Index() {
  return (
    <div className='container'>
      <div className='content'>
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to='jokes'>Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
