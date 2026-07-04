import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from './db';
import env from './utils/env';
import * as schema from '../lib/db/schema';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      ...schema,
    },
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
    passwordValidator(password: string) {
      if (password.length < 8) return false;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasDigit = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      return hasUpper && hasLower && hasDigit && hasSpecial;
    },
  },
  advanced: {
    ipAddress: {
      disableIpTracking: true,
    },
  },
  trustedOrigins: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
});

export type AuthInstance = typeof auth;
