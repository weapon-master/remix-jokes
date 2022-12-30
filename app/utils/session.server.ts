import { db } from './db.server';

import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

interface LoginForm {
  username: string;
  password: string;
}

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return null;
  }
  const isPasswdCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswdCorrect) {
    return null;
  }
  return { id: user.id, username };
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET should be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const getUserSession = (request: Request) =>
  storage.getSession(request.headers.get('Cookie'));

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  return userId;
};

export const requireUserId = async (request: Request, redirectTo: string) => {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);
  const destroyedCookie = await storage.destroySession(session);
  return redirect('/login', {
    headers: {
      'Set-Cookie': destroyedCookie,
    },
  });
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { username: true, id: true },
    });
    return user;
  } catch (e) {
    throw logout(request);
  }
};

export const register = async ({ username, password }: LoginForm) => {
  const passwdHash = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: { username, passwordHash: passwdHash },
  });
  return { id: newUser.id, username };
};

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set('userId', userId);
  const cookie = await storage.commitSession(session);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': cookie,
    },
  });
};
