import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '../lib/db';
import * as schema from '../lib/db/schema';
import { user as userTable } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import env from '../lib/utils/env';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@cv-matcha.com';
  const password = process.env.ADMIN_PASSWORD || 'SuperSecret123!';
  const name = 'Admin';

  const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, { provider: 'sqlite', schema }),
    emailAndPassword: {
      enabled: true,
    },
  });

  const [existing] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));
  if (existing) {
    if (existing.role !== 'admin') {
      await db
        .update(userTable)
        .set({ role: 'admin' })
        .where(eq(userTable.id, existing.id));
      console.log(`User ${email} promoted to admin.`);
    } else {
      console.log(`Admin user ${email} already exists.`);
    }
    return;
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  if (result.user) {
    await db
      .update(userTable)
      .set({ role: 'admin' })
      .where(eq(userTable.id, result.user.id));
    console.log(`Admin user ${email} created successfully.`);
  } else {
    console.error('Failed to create admin user.');
  }

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
