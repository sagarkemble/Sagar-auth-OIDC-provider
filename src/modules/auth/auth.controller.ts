import type { Request, Response } from "express";
import * as AuthService from "./auth.service";
import ApiResponse from "../../common/utils/api-response.utils";
import path from "path";

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

export { register, getRegister, verifyEmail, getVerifyEmail, login };
