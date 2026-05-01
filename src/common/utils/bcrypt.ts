import bcrypt from "bcryptjs";

const hashContent = async function (content: string) {
  const hashedContent = await bcrypt.hash(content, 12);
  return hashedContent;
};

export { hashContent };
