import path from "path";
import type { Request, Response } from "express";
import ApiResponse from "../../common/utils/api-response.utils";
import * as clientService from "./client.service";

const getRegister = (req: Request, res: Response) => {
  const filePath = path.resolve("public", "html", "register-client.html");
  ApiResponse.html(res, filePath, "success");
};

const register = async function (req: Request, res: Response) {
  const {
    applicationName,
    applicationDescription,
    applicationUrl,
    redirectUrl,
  } = req.body;
  const newClient = await clientService.register(
    applicationName,
    applicationDescription,
    applicationUrl,
    redirectUrl,
  );
  ApiResponse.created(res, "Client registered successfully", newClient);
};

export { getRegister, register };
