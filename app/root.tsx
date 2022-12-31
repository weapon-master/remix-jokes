import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import globalStylesUrl from '~/styles/global.css';
import globalMediumStylesUrl from '~/styles/global-medium.css';
import globalLargeStylesUrl from '~/styles/global-large.css';
import type { FC, ReactNode } from 'react';

/**
 * This is the root of React
 */

const description = 'Learn Remix an laugh at the same time';
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Jokes',
  description,
  keywords: 'Remix, jokes',
  viewport: 'width=device-width,initial-scale=1',
  'twitter:image': 'https://remix-jokes.lol/social.png',
  'twitter:card': 'summary_large_image',
  'twitter:creator': '@remix_run',
  'twitter:site': '@remix_run',
  'twitter:title': 'Remix Jokes',
  'twitter:description': description,
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStylesUrl },
  {
    rel: 'stylesheet',
    href: globalMediumStylesUrl,
    media: 'print, (min-width: 640px)',
  },
  {
    rel: 'stylesheet',
    href: globalLargeStylesUrl,
    media: 'screen, (min-width: 1024px)',
  },
];

const Document: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <html lang='en'>
    <head>
      <Meta />
      {/* this title is a fallback in case that title is not provided by Metas */}
      <title>Remix Jokes!!!</title>
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </html>
);

export default function App() {
  return (
    <Document title='Remix Jokes'>
      <Outlet />
    </Document>
  );
}

export const CatchBoundary = () => {
  const caught = useCatch();
  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className='error-container'>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => (
  <Document title='Remix Jokes'>
    <div className='error-container'>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </div>
  </Document>
);
