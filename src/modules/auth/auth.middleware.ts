import type { Response, Request, NextFunction } from "express";
import db from "../../common/config/db.config";
import clientTable from "../client/client.model";
import { eq } from "drizzle-orm";
import ApiError from "../../common/utils/api-error.utils";
import * as cryptoUtils from "../../common/utils/crypto";

const verifyClientId = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { clientId } = req.query;
  if (!clientId || typeof clientId !== "string") {
    throw ApiError.badRequest("clientId is required and must be a string");
  }
  const hashedClientId = await cryptoUtils.hashContent(clientId);

  const [isValidClientId] = await db
    .select()
    .from(clientTable)
    .where(eq(clientTable.clientId, hashedClientId));
  if (!isValidClientId) {
    throw ApiError.badRequest("Invalid clientId");
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
