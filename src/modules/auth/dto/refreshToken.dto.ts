import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class refreshTokenDto extends BaseDto {
  static override schema = z.object({
    refreshToken: z.string(),
    clientSecret: z.string(),
  });
}

export default refreshTokenDto;
