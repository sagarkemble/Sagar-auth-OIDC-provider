import crypto from "crypto";
const generateCryptoHash = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};

export { generateCryptoHash };
