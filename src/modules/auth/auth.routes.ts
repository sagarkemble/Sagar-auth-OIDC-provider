import router from "express";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";
import * as authController from "./auth.controller";
import verifyEmailDto from "./dto/verify-email.dto";
import { verifyClientId } from "./auth.middleware";
import loginDto from "./dto/login.dto";
import generateTokenDto from "./dto/generateToken.dto";
import forgetPasswordDto from "./dto/forgot-password.dto";
import resetPasswordDto from "./dto/reset-password.dto";
import refreshTokenDto from "./dto/refreshToken.dto";

export const authRouter = router();

authRouter.post("/register", validateDto(registerDto), authController.register);
authRouter.get("/register", authController.getRegister);
authRouter.post(
  "/verify-email",
  validateDto(verifyEmailDto),
  authController.verifyEmail,
);
authRouter.post(
  "/login",
  verifyClientId,
  validateDto(loginDto),
  authController.login,
);
authRouter.get("/login", verifyClientId, authController.getLogin);
authRouter.get("/verify-email", authController.getVerifyEmail);
authRouter.post(
  "/token",
  verifyClientId,
  validateDto(generateTokenDto),
  authController.generateToken,
);

authRouter.get("/userinfo", authController.getUserInfo);

authRouter.post(
  "/refresh-token",
  validateDto(refreshTokenDto),
  authController.refreshToken,
);
authRouter.post(
  "/forgot-password",
  validateDto(forgetPasswordDto),
  authController.forgotPassword,
);

authRouter.get("/reset-password", authController.getResetPassword);
authRouter.post(
  "/reset-password",
  validateDto(resetPasswordDto),
  authController.resetPassword,
);
