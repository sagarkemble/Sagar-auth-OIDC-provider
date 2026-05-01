import express, { urlencoded, type NextFunction } from "express";
import globalErrorHandler from "./common/middleware/globlaErrorHandler.middleware";
import cookieParser from "cookie-parser";
import { clientRouter } from "./modules/client/client.routes";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/client", clientRouter);
app.use(globalErrorHandler);
