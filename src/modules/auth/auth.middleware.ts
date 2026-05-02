import type { Response, Request, NextFunction } from "express";
import db from "../../common/config/db.config";
import clientTable from "../client/client.model";
import { eq } from "drizzle-orm";
import ApiError from "../../common/utils/api-error.utils";
import * as cryptoUtils from "../../common/utils/crypto";
import ApiResponse from "../../common/utils/api-response.utils";
import path from "path";

const verifyClientId = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { clientId } = req.query;
  const htmlPath = path.resolve("public", "html", "unauthorized.html");
  if (!clientId || typeof clientId !== "string") {
    return ApiResponse.html(res, htmlPath, "error");
  }
  const hashedClientId = await cryptoUtils.hashContent(clientId);

  const [isValidClientId] = await db
    .select()
    .from(clientTable)
    .where(eq(clientTable.clientId, hashedClientId));
  if (!isValidClientId) {
    return ApiResponse.html(res, htmlPath, "error");
  }
  req.clientInfo = {
    clientId,
    clientTableEntryId: isValidClientId.id,
    applicationName: isValidClientId.applicationName,
    redirectUrl: isValidClientId.redirectUrl,
  };
  next();
};

export { verifyClientId };
