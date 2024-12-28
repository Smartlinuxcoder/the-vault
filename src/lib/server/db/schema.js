import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: integer('id').primaryKey(),
  username: text('username').unique().notNull(),
  quota: integer('quota').notNull().default(536870912), // 512MB in bytes
  publicKey: text('public_key').notNull(),
  utilizedSpace: integer('utilized_space').notNull().default(0)
});

export const files = sqliteTable('files', {
    id: integer('id').primaryKey(),
    owner: integer('owner').notNull(),
    hash: text('hash').notNull(),
    size: integer().notNull().default(0), //size in bytes
});