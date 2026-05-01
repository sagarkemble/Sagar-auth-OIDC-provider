import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "./models/auth.users.model";
import ApiError from "../../common/utils/api-error.utils";
import { hashContent } from "../../common/utils/bcrypt";
import { generateCryptoHash } from "../../common/utils/crypto";
import userCodesTable from "./models/auth.userCodes.model";

const register = async function (
  firstName: string,
  lastName: string,
  email: string,
  gender: "male" | "female" | "other",
  dateOfBirth: string,
  password: string,
  avatarUrl: string,
) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (user) throw ApiError.conflict("User with this email already exists");
  const hashedPassword = await hashContent(password);
  const [newUser] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      email,
      password: hashedPassword,
      avatarUrl,
    })
    .returning();
  const { token: authorizationCode, hashedToken: hashedAuthorizationCode } =
    await generateCryptoHash();
  const authorizationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await db.insert(userCodesTable).values({
    userId: newUser!.id,
    authorizationCode: hashedAuthorizationCode,
    authorizationCodeExpiresAt,
  });
  return authorizationCode;
};

export { register };
