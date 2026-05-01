import path from "path";
import type { Request, Response } from "express";
import ApiResponse from "../../common/utils/api-response.utils";

const getRegister = (req: Request, res: Response) => {
  const filePath = path.resolve(
    "src",
    "modules",
    "client",
    "templates",
    "pages",
    "register.html",
  );
  ApiResponse.html(res, filePath, "success");
};

export { getRegister };
