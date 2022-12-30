import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import globalStylesUrl from '~/styles/global.css';
import globalMediumStylesUrl from '~/styles/global-medium.css';
import globalLargeStylesUrl from '~/styles/global-large.css';
import type { FC, ReactNode } from 'react';

/**
 * This is the root of React
 */
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
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
      <title>{title}</title>
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

export const ErrorBoundary = ({ error }: { error: Error }) => (
  <Document title='Remix Jokes'>
    <div className='error-container'>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </div>
  </Document>
);
