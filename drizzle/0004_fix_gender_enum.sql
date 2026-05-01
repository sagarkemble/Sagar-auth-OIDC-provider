-- Drop the old enum and recreate with lowercase values
ALTER TABLE "users" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "gender" TYPE text;

DROP TYPE "gender";

CREATE TYPE "gender" AS ENUM ('male', 'female', 'other');

ALTER TABLE "users" ALTER COLUMN "gender" TYPE "gender" USING "gender"::text::gender;
