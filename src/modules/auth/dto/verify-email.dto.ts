import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class verifyEmailDto extends BaseDto {
  static override schema = z.object({
    token: z.string(),
  });
}

export default verifyEmailDto;
