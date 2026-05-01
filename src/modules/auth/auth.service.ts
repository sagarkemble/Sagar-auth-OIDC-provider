import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "./models/auth.users.model";
import ApiError from "../../common/utils/api-error.utils";
import * as bcryptUtils from "../../common/utils/bcrypt";
import * as cryptoUtils from "../../common/utils/crypto";
import { sendVerificationEmail } from "./auth.email.service";
import userCodesTable from "./models/auth.userCodes.model";
import JWT from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../common/utils/cert";
import clientTable from "../client/client.model";

interface JWTClaims {
  sub: string;
  email: string;
  email_verified: string;
  given_name: string;
  family_name: string;
  name: string;
  picture: string;
}
const ISSUER = process.env.SERVER_URL;
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

const generateTokens = async function (
  authorizationCode: string,
  clientSecret: string,
) {
  const hashedAuthorizationCode =
    await cryptoUtils.hashContent(authorizationCode);
  const [userCodeEntry] = await db
    .select()
    .from(userCodesTable)
    .where(eq(userCodesTable.authorizationCode, hashedAuthorizationCode));
  if (
    !userCodeEntry ||
    Date.now() > Number(userCodeEntry.authorizationCodeExpiresAt)
  )
    throw ApiError.badRequest("Invalid or expired authorization code");

  const hashedClientSecret = await cryptoUtils.hashContent(clientSecret);
  const [client] = await db
    .select()
    .from(clientTable)
    .where(eq(clientTable.clientSecret, hashedClientSecret));
  if (!client) throw ApiError.unauthorized("Invalid client secret");
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userCodeEntry.userId));
  if (!user) throw ApiError.notFound("User not found");
  const claims = {
    iss: ISSUER,
    sub: user.id,
    email: user.email,
    email_verified: String(user.isVerified),
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
    given_name: user.firstName,
    family_name: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    picture: user.avatarUrl,
  };
  const accessToken = JWT.sign(claims, PRIVATE_KEY, { algorithm: "RS256" });
  const { token: refreshToken, hashedToken: hashedRefreshToken } =
    await cryptoUtils.generateHash();
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db
    .update(userCodesTable)
    .set({
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt,
    })
    .where(eq(userCodesTable.authorizationCode, hashedAuthorizationCode));
  return { accessToken, refreshToken };
};

const getUserInfo = async function (accessToken: string) {
  let claims: JWTClaims;
  try {
    claims = JWT.verify(accessToken, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as JWTClaims;
  } catch {
    throw ApiError.unauthorized("Invalid access token");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, claims.sub));
  if (!user) throw ApiError.notFound("User not found");
  return {
    sub: user.id,
    email: user.email,
    email_verified: String(user.isVerified),
    given_name: user.firstName,
    family_name: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    picture: user.avatarUrl,
  };
};

export { register, verifyEmail, login, generateTokens, getUserInfo };
