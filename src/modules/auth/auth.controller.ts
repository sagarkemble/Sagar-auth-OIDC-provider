import type { Request, Response } from "express";
import * as AuthService from "./auth.service";
import ApiResponse from "../../common/utils/api-response.utils";
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
  const authorizationCode = await AuthService.register(
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
    "User registered successfully,The authorization code is valid for 5 minutes",
    { authorizationCode },
  );
};

export { register };
