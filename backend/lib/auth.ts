import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from './db';
import env from './utils/env';
import * as schema from '../lib/db/schema';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { ...schema },
  }),
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  trustedOrigins: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
  advanced: {
    ipAddress: {
      disableIpTracking: true,
    },
    cookies: {
      session: {
        attributes: {
          sameSite: 'none',
          secure: true,
        },
      },
      csrf: {
        attributes: {
          sameSite: 'none',
          secure: true,
        },
      },
    },
  },
});

export type AuthInstance = typeof auth;
