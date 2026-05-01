import crypto from "crypto";
const generateHash = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};
const hashContent = async function (content: string) {
  const hashedContent = crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
  return hashedContent;
};

export { generateHash, hashContent };
