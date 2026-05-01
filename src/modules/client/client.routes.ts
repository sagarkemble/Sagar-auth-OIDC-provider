import router from "express";
import * as clientController from "./client.controller";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";

export const clientRouter = router();
clientRouter.get("/register", (req, res) => {
  clientController.getRegister(req, res);
});

clientRouter.post(
  "/register",
  validateDto(registerDto),
  clientController.register,
);
