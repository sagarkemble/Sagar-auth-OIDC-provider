import express, { urlencoded, type NextFunction } from "express";
import globalErrorHandler from "./common/middleware/globlaErrorHandler.middleware";
import cookieParser from "cookie-parser";
import { clientRouter } from "./modules/client/client.routes";
import { authRouter } from "./modules/auth/auth.routes";
import path from "path";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("public")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/client", clientRouter);
app.use("/auth", authRouter);
app.use(globalErrorHandler);
