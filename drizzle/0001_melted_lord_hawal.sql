ALTER TABLE "clients" ADD CONSTRAINT "clients_application_name_unique" UNIQUE("application_name");--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_redirect_url_unique" UNIQUE("redirect_url");--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_application_url_unique" UNIQUE("application_url");