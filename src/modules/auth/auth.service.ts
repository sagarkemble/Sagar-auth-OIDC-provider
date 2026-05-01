import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "./models/auth.users.model";
import ApiError from "../../common/utils/api-error.utils";
import * as bcryptUtils from "../../common/utils/bcrypt";
import * as cryptoUtils from "../../common/utils/crypto";
import { sendVerificationEmail } from "./auth.email.service";
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
  const hashedPassword = await bcryptUtils.hashContent(password);
  const {
    token: emailVerificationToken,
    hashedToken: hashedEmailVerificationToken,
  } = await cryptoUtils.generateHash();
  const emailVerificationTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

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
      emailVerificationToken: hashedEmailVerificationToken,
      emailVerificationTokenExpiresAt,
    })
    .returning();
  await sendVerificationEmail(email, emailVerificationToken);
};
const verifyEmail = async function (token: string) {
  const hashedToken = await cryptoUtils.hashContent(token);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.emailVerificationToken, hashedToken));
  if (!user || Date.now() > Number(user.emailVerificationTokenExpiresAt))
    throw ApiError.badRequest("Invalid or expired token");
  await db
    .update(usersTable)
    .set({
      isVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
    })
    .where(eq(usersTable.emailVerificationToken, hashedToken));
};

const login = async function (
  email: string,
  password: string,
  clientId: string,
  clientTableEntryId: string,
) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) throw ApiError.notFound("User not found");
  if (!user.isVerified)
    throw ApiError.unauthorized("Please verify your email to login");
  const isPasswordValid = await bcryptUtils.compareHash(
    password,
    user.password,
  );
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid credentials");
  const { token: authorizationCode, hashedToken: hashedAuthorizationCode } =
    await cryptoUtils.generateHash();
  const authorizationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await db.insert(userCodesTable).values({
    clientId: clientTableEntryId,
    userId: user.id,
    authorizationCode: hashedAuthorizationCode,
    authorizationCodeExpiresAt,
  });
  return authorizationCode;
};

export { register, verifyEmail, login };
