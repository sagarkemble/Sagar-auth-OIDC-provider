CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_name" varchar(50) NOT NULL,
	"application_description" varchar(200) NOT NULL,
	"redirect_url" text NOT NULL,
	"application_url" text NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_application_name_unique" UNIQUE("application_name"),
	CONSTRAINT "clients_redirect_url_unique" UNIQUE("redirect_url"),
	CONSTRAINT "clients_application_url_unique" UNIQUE("application_url")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(254) NOT NULL,
	"gender" varchar(20),
	"date_of_birth" date,
	"password" text NOT NULL,
	"avatar_url" text DEFAULT 'https://ik.imagekit.io/lespresources/auth-service-avatars/default-avtar-1233321123321123321.jpg?updatedAt=1776092643846',
	"password_reset_token" text,
	"email_verification_token" text,
	"password_reset_token_expires_at" timestamp,
	"email_verification_token_expires_at" timestamp,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid,
	"user_id" uuid NOT NULL,
	"refresh_token" text,
	"authorization_code" text,
	"refresh_token_expires_at" timestamp,
	"authorization_code_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_codes" ADD CONSTRAINT "user_codes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_codes" ADD CONSTRAINT "user_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;