import { PrismaClient } from '@prisma/client';
/**
 * *.server.ts convention is to inform compiler to exclude
 * this file from bundled to browser code
 */
declare global {
  var __db: PrismaClient | undefined;
}

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  // live-reloading leads to multiple connections to db
  // this approach prevents creating multiple connections
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };
