import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

const clientTable = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  applicationName: varchar("application_name", { length: 50 })
    .notNull()
    .unique(),
  applicationDescription: varchar("application_description", {
    length: 200,
  }).notNull(),
  redirectUrl: text("redirect_url").notNull().unique(),
  applicationUrl: text("application_url").notNull().unique(),
  clientId: text("client_id").notNull(),
  clientSecret: text("client_secret").notNull(),
});

export default clientTable;
