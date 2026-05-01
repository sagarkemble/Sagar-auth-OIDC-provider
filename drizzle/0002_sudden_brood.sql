CREATE TYPE "gender" AS ENUM ('Male', 'Female', 'Other');

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(254) NOT NULL,
	"gender" "gender",
	"date_of_birth" date,
	"password" text NOT NULL,
	"avatar_url" text DEFAULT 'https://ik.imagekit.io/lespresources/auth-service-avatars/default-avtar-1233321123321123321.jpg?updatedAt=1776092643846',
	"password_reset_token" text,
	"email_verification_token" text,
	"password_reset_token_expires_at" timestamp,
	"email_verification_token_expires_at" timestamp,
	"is_verified" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
