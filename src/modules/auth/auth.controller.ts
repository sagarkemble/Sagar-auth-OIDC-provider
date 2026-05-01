import type { Request, Response } from "express";
import * as AuthService from "./auth.service";
import ApiResponse from "../../common/utils/api-response.utils";
import path from "path";
import ApiError from "../../common/utils/api-error.utils";

const register = async function (req: Request, res: Response) {
  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    password,
    avatarUrl,
  } = req.body;
  await AuthService.register(
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    password,
    avatarUrl,
  );
  ApiResponse.created(
    res,
    "User registered successfully, please check your email to verify your account.",
  );
};

const getRegister = function (_req: Request, res: Response) {
  res.sendFile(path.resolve("public/authPage/register.html"));
};

const verifyEmail = async function (req: Request, res: Response) {
  const { token } = req.body;
  await AuthService.verifyEmail(token);
  ApiResponse.ok(res, "Email verified successfully.");
};

const getVerifyEmail = async function (req: Request, res: Response) {
  const emailHtmlPath = path.resolve("public", "html", "verify-email.html");
  ApiResponse.html(res, emailHtmlPath, "success");
};

const login = async function (req: Request, res: Response) {
  const { clientId, clientTableEntryId } = req.clientInfo!;
  const { email, password } = req.body;
  const authorizationCode = await AuthService.login(
    email,
    password,
    clientId,
    clientTableEntryId,
  );
  ApiResponse.ok(
    res,
    "Authorization code sent,Verify at /token endpoint to get access token and refresh token.",
    authorizationCode,
  );
};

const generateToken = async function (req: Request, res: Response) {
  const { authorizationCode, clientSecret } = req.body;
  const { accessToken, refreshToken } = await AuthService.generateTokens(
    authorizationCode,
    clientSecret,
  );
  ApiResponse.ok(res, "Tokens generated successfully.", {
    accessToken,
    refreshToken,
  });
};

const getUserInfo = async function (req: Request, res: Response) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) throw ApiError.unauthorized("Access token missing");
  const userInfo = await AuthService.getUserInfo(accessToken);
  ApiResponse.ok(res, "User info retrieved successfully.", userInfo);
};

const refreshToken = async function (req: Request, res: Response) {
  const { refreshToken, clientSecret } = req.body;
  const { accessToken, refreshToken: newRefreshToken } =
    await AuthService.refreshToken(refreshToken, clientSecret);
  ApiResponse.ok(res, "Tokens refreshed successfully.", {
    accessToken,
    refreshToken: newRefreshToken,
  });
};

export {
  register,
  getRegister,
  verifyEmail,
  getVerifyEmail,
  login,
  generateToken,
  getUserInfo,
  refreshToken,
};
