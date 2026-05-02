import express, { urlencoded, type NextFunction } from "express";
import globalErrorHandler from "./common/middleware/globlaErrorHandler.middleware";
import cookieParser from "cookie-parser";
import { clientRouter } from "./modules/client/client.routes";
import { authRouter } from "./modules/auth/auth.routes";
import path from "path";
import ApiResponse from "./common/utils/api-response.utils";
import jose from "node-jose";
import { PUBLIC_KEY } from "./common/utils/cert";
import cors from "cors";

export const app = express();
const landingPagePath = path.resolve("public", "html", "landing-page.html");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("public")));
app.use(cors());

app.get("/", (req, res) => {
  ApiResponse.html(res, landingPagePath, "success");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/.well-known/openid-configuration", (req, res) => {
  const baseUrl = process.env.SERVER_URL;
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/auth/login`,
    token_endpoint: `${baseUrl}/auth/token`,
    userinfo_endpoint: `${baseUrl}/auth/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    registration_endpoint: `${baseUrl}/client/register`,
    scopes_supported: ["openid", "profile", "email"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    token_endpoint_auth_methods_supported: ["client_secret_post"],
    claims_supported: [
      "sub",
      "iss",
      "email",
      "email_verified",
      "given_name",
      "family_name",
      "name",
      "picture",
    ],
    code_challenge_methods_supported: [],
  });
});
app.get("/.well-known/jwks.json", async (_, res) => {
  const key = await jose.JWK.asKey(PUBLIC_KEY, "pem");
  res.json({ keys: [key.toJSON()] });
});
app.use("/client", clientRouter);
app.use("/auth", authRouter);
app.use((req, res) => {
  const filePath = path.resolve("public", "html", "not-found.html");
  ApiResponse.html(res, filePath, "error");
});
app.use(globalErrorHandler);
