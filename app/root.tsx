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

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        {/*  Links is used to import all links exported by active routes */}
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
