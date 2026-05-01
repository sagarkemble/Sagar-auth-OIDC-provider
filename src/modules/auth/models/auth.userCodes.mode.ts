import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import clientTable from "../../client/client.model";
import usersTable from "./auth.users.model";

const userCodesTable = pgTable("user_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clientTable.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  refreshToken: text("refresh_token"),
  authorizationCode: text("authorization_code"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  authorizationCodeExpiresAt: timestamp("authorization_code_expires_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export default userCodesTable;
