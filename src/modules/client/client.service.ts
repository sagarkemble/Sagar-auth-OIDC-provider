import { eq, or } from "drizzle-orm";
import db from "../../common/config/db.config";
import clientTable from "./client.model";
import ApiError from "../../common/utils/api-error.utils";
import { generateCryptoHash } from "../../common/utils/crypto";

const register = async function (
  applicationName: string,
  applicationDescription: string,
  applicationUrl: string,
  applicationRedirectUrl: string,
) {
  const [client] = await db
    .select()
    .from(clientTable)
    .where(
      or(
        eq(clientTable.applicationName, applicationName),
        eq(clientTable.redirectUrl, applicationRedirectUrl),
        eq(clientTable.applicationUrl, applicationUrl),
      ),
    );
  if (client)
    throw ApiError.conflict(
      "Client with the same application name already exists",
    );

  const { token: clientId, hashedToken: hashedClientId } =
    await generateCryptoHash();
  const { token: clientSecret, hashedToken: hashedClientSecret } =
    await generateCryptoHash();

  const [newClient] = await db
    .insert(clientTable)
    .values({
      applicationName,
      applicationDescription,
      applicationUrl,
      redirectUrl: applicationRedirectUrl,
      clientId: hashedClientId,
      clientSecret: hashedClientSecret,
    })
    .returning();
  return newClient;
};

export { register };
