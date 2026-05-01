import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

const genderEnum = pgEnum("gender", ["Male", "Female", "Other"]);
const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  gender: genderEnum("gender"),
  dateOfBirth: date("date_of_birth"),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url").default(
    "https://ik.imagekit.io/lespresources/auth-service-avatars/default-avtar-1233321123321123321.jpg?updatedAt=1776092643846",
  ),
  passwordResetToken: text("password_reset_token"),
  emailVerificationToken: text("email_verification_token"),
  passwordResetTokenExpiresAt: timestamp("password_reset_token_expires_at"),
  emailVerificationTokenExpiresAt: timestamp(
    "email_verification_token_expires_at",
  ),
  isVerified: boolean("is_verified").default(false),
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at"),
});

export default usersTable;
