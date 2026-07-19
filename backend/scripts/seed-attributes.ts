import db from '../lib/db';
import { categories } from '../lib/db/schema/categories';
import { attributes } from '../lib/db/schema/attributes';

async function seed() {
  const categoryNames = [
    'Certification',
    'Domain Knowledge',
    'Personal Information',
    'Soft Skills',
    'Education',
    'Language',
    'Experience',
    'Technical Skills',
  ];

  for (const name of categoryNames) {
    await db.insert(categories).values({ name }).onConflictDoNothing();
  }

  const allCategories = await db.select().from(categories);
  const getCatId = (name: string) =>
    allCategories.find((c) => c.name === name)?.id!;

  const builtIn = [
    {
      name: 'First Name',
      type: 'string' as const,
      category: 'Personal Information',
    },
    {
      name: 'Last Name',
      type: 'string' as const,
      category: 'Personal Information',
    },
    {
      name: 'Location',
      type: 'string' as const,
      category: 'Personal Information',
    },
    {
      name: 'Personal Photo',
      type: 'image' as const,
      category: 'Personal Information',
    },
  ];

  for (const attr of builtIn) {
    await db
      .insert(attributes)
      .values({
        categoryId: getCatId(attr.category),
        name: attr.name,
        type: attr.type,
        isBuiltIn: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  }

  console.log('Categories and built‑in attributes seeded');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
