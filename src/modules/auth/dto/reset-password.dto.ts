import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class resetPasswordDto extends BaseDto {
  static override schema = z.object({
    token: z.string(),
    password: z
      .string()
      .min(8, "Invalid password")
      .max(32, "Invalid password")
      .regex(/[A-Z]/, "Invalid password")
      .regex(/[a-z]/, "Invalid password")
      .regex(/[0-9]/, "Invalid password")
      .regex(/[@$!%*?&]/, "Invalid password"),
  });
}

export default resetPasswordDto;
