import path from 'node:path';
import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://xentri:xentri_dev@localhost:5432/xentri';

export default defineConfig({
  earlyAccess: true,
  schema: path.join(import.meta.dirname, 'prisma/schema.prisma'),

  datasource: {
    url: databaseUrl,
  },

  migrate: {
    async url() {
      return databaseUrl;
    },
  },
});
