CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_name" varchar(50) NOT NULL,
	"application_description" varchar(200) NOT NULL,
	"redirect_url" text NOT NULL,
	"application_url" text NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL
);
