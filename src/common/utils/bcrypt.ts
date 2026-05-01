import bcrypt from "bcryptjs";

const hashContent = async function (content: string) {
  const hashedContent = await bcrypt.hash(content, 12);
  return hashedContent;
};

const compareHash = async function (content: string, hash: string) {
  const isMatch = await bcrypt.compare(content, hash);
  return isMatch;
};

export { hashContent, compareHash };
