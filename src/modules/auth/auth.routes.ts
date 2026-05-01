import router from "express";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";
import * as authController from "./auth.controller";
import verifyEmailDto from "./dto/verify-email.dto";
import { verifyClientId } from "./auth.middleware";
import loginDto from "./dto/login.dto";

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
authRouter.get("/verify-email", authController.getVerifyEmail);
