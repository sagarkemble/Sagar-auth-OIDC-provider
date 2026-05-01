import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/modules/client/client.model.ts",
    "./src/modules/auth/models/auth.users.model.ts",
    "./src/modules/auth/models/auth.userCodes.model.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URI,
  },
});
