import BaseDto from "../../../common/dto/base.dto";
import z from "zod";

class registerDto extends BaseDto {
  static override schema = z.object({
    applicationName: z
      .string()
      .min(3, "Application name must be at least 3 characters")
      .max(50, "Application name must be at most 50 characters")
      .trim()
      .toLowerCase(),
    applicationDescription: z
      .string()
      .min(10, "Application description must be at least 10 characters")
      .max(200, "Application description must be at most 200 characters")
      .trim()
      .toLowerCase(),
    applicationUrl: z.url("Invalid application URL").trim(),
    redirectUrl: z.url("Invalid redirect URL").trim(),
  });
}
export default registerDto;
