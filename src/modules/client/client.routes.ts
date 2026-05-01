import router from "express";
import * as clientController from "./client.controller";

export const clientRouter = router();
clientRouter.get("/register", (req, res) => {
  clientController.getRegister(req, res);
});
