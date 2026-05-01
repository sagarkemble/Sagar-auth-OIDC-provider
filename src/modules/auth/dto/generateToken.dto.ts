import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class generateTokenDto extends BaseDto {
  static override schema = z.object({
    authorizationCode: z.string(),
    clientSecret: z.string(),
  });
}

export default generateTokenDto;
