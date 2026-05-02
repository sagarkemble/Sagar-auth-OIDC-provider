<div align="center">
  <img src="./public/favicon.png" style="height:5rem" />

# OIDC Provider

</div>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" /></a>
  <a href="#"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=mailgun&logoColor=white" alt="Resend" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Commitlint-000000?style=for-the-badge&logo=git&logoColor=white" alt="Commitlint" /></a>
</p>

A production-ready **OpenID Connect (OIDC) provider** built with TypeScript, Bun, Express, and PostgreSQL. Implements the Authorization Code flow with RS256-signed JWTs, full user lifecycle management, and a built-in UI for registration, login, and client management.

---

## Features

- **OIDC Authorization Code Flow** — full `/authorize → /token → /userinfo` pipeline
- **RS256 JWT** — access tokens signed with an asymmetric RSA key pair; public key exposed via `/.well-known/jwks.json`
- **OpenID Discovery** — `/.well-known/openid-configuration` endpoint for auto-configuration
- **Client Registration** — register OAuth applications with `clientId` / `clientSecret`
- **User Registration** — with avatar selection, gender, and date of birth
- **Email Verification** — token-based, expires in 5 minutes
- **Forgot / Reset Password** — secure token flow with 15-minute expiry
- **Refresh Token Rotation** — issue and rotate refresh tokens, valid for 7 days
- **Runtime Validation** — all inputs validated with Zod DTOs
- **Built-in UI** — register, login, verify email, reset password, and client registration pages served as static HTML
- **Docker** — one-command PostgreSQL setup with Docker Compose
- **Conventional Commits** — Commitizen + Commitlint + Husky enforced

---

## Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Docker](https://www.docker.com/) & Docker Compose
- A [Resend](https://resend.com/) account for transactional email

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sagarkemble/oidc-provider
cd oidc-provider
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URI=postgres://admin:password@localhost:5432/oidc_provider_db
RESEND_API_KEY=your_resend_api_key
SERVER_URL=http://localhost:3000
FROM_EMAIL=noreply@yourdomain.dev
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENV=development
```

> **Note:** The RSA key pair lives in the `cert/` directory (`private-key.pem` / `public-key.pub`). Run `./key-gen.sh` to regenerate them if needed.

### 4. Start PostgreSQL with Docker

```bash
bun run db:up
```

This spins up a PostgreSQL container with:

| Setting  | Value              |
| -------- | ------------------ |
| Host     | `localhost:5432`   |
| User     | `admin`            |
| Password | `password`         |
| Database | `oidc_provider_db` |

To stop it:

```bash
bun run db:down
```

### 5. Run database migrations

```bash
bun run db:generate   # generate migration files from schema
bun run db:migrate    # apply migrations to the database
```

### 6. Start the development server

```bash
bun run dev
```

The server starts at `http://localhost:3000`.

---

## Project Structure

```
oidc-provider/
├── cert/                          # RSA key pair (private + public)
├── public/
│   ├── html/                      # Served UI pages
│   │   ├── landing-page.html
│   │   ├── register.html
│   │   ├── login.html
│   │   ├── register-client.html
│   │   ├── verify-email.html
│   │   ├── change-password.html
│   │   ├── not-found.html
│   │   └── unauthorized.html
│   └── emails/                    # Email HTML templates
│       ├── verification-email.html
│       └── forgot-password.html
├── src/
│   ├── app.ts                     # Express app setup
│   ├── index.ts                   # Server entrypoint
│   ├── common/
│   │   ├── config/                # DB + email config
│   │   ├── dto/                   # Base Zod DTO class
│   │   ├── middleware/            # Global error handler, DTO validator
│   │   └── utils/                # ApiError, ApiResponse, bcrypt, crypto, cert
│   └── modules/
│       ├── auth/                  # Auth module
│       │   ├── models/            # users + userCodes Drizzle tables
│       │   ├── dto/               # Zod schemas for each endpoint
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.routes.ts
│       │   ├── auth.middleware.ts
│       │   └── auth.email.service.ts
│       └── client/                # Client registration module
│           ├── dto/
│           ├── client.model.ts
│           ├── client.service.ts
│           ├── client.controller.ts
│           └── client.routes.ts
├── drizzle.config.js
├── docker-compose.yml
├── tsconfig.json
└── package.json
```

---

## API Reference

### Well-Known Endpoints

| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| `GET`  | `/.well-known/openid-configuration` | OIDC discovery document      |
| `GET`  | `/.well-known/jwks.json`            | Public RSA key in JWK format |

### Client Routes — `/client`

#### Register a client application

```http
POST /client/register
Content-Type: application/json
```

```json
{
  "applicationName": "my-app",
  "applicationDescription": "A short description of my application",
  "applicationUrl": "https://myapp.example.com",
  "redirectUrl": "https://myapp.example.com/auth/callback"
}
```

**Response**

```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "clientId": "plain_client_id",
    "clientSecret": "plain_client_secret"
  }
}
```

> Store `clientId` and `clientSecret` securely — they are only returned once.

---

### Auth Routes — `/auth`

#### Register a user

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "firstName": "sagar",
  "lastName": "kemble",
  "email": "sagar@example.com",
  "gender": "male",
  "dateOfBirth": "2000-01-01",
  "password": "P@ssword1",
  "avatarUrl": "https://cdn.example.com/avatar.png"
}
```

**Password rules:** 8–32 characters, at least one uppercase, one lowercase, one number, one special character (`@$!%*?&`).

---

#### Verify email

```http
POST /auth/verify-email
Content-Type: application/json
```

```json
{
  "token": "token_from_verification_email"
}
```

> Token expires in **5 minutes**.

---

#### Login (Authorization Code)

```http
POST /auth/login?clientId=<your_client_id>
Content-Type: application/json
```

```json
{
  "email": "sagar@example.com",
  "password": "P@ssword1"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://myapp.example.com/auth/callback?code=authorization_code"
  }
}
```

> The `clientId` query parameter must be a valid registered client ID.

---

#### Exchange code for tokens

```http
POST /auth/token?clientId=<your_client_id>
Content-Type: application/json
```

```json
{
  "authorizationCode": "code_from_redirect",
  "clientSecret": "your_client_secret"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "opaque_refresh_token"
  }
}
```

> Authorization codes expire in **5 minutes** and are single-use.

---

#### Get user info

```http
GET /auth/userinfo
Authorization: Bearer <access_token>
```

**Response**

```json
{
  "sub": "uuid",
  "email": "sagar@example.com",
  "email_verified": "true",
  "given_name": "sagar",
  "family_name": "kemble",
  "name": "sagar kemble",
  "picture": "https://cdn.example.com/avatar.png"
}
```

---

#### Refresh access token

```http
POST /auth/refresh-token
Content-Type: application/json
```

```json
{
  "refreshToken": "opaque_refresh_token",
  "clientSecret": "your_client_secret"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "new_opaque_refresh_token"
  }
}
```

> Refresh tokens rotate on every use. Old tokens are immediately invalidated.

---

#### Forgot password

```http
POST /auth/forgot-password
Content-Type: application/json
```

```json
{
  "email": "sagar@example.com"
}
```

> Sends a reset link to the email if an account exists. Token expires in **15 minutes**.

---

#### Reset password

```http
POST /auth/reset-password
Content-Type: application/json
```

```json
{
  "token": "token_from_reset_email",
  "password": "NewP@ssword1"
}
```

---

### UI Pages

These pages are served as HTML and are used by the built-in frontend:

| Route                           | Description              |
| ------------------------------- | ------------------------ |
| `GET /`                         | Landing page             |
| `GET /auth/register`            | User registration form   |
| `GET /auth/login?clientId=<id>` | Login / consent screen   |
| `GET /auth/verify-email`        | Email verification page  |
| `GET /auth/reset-password`      | Password reset form      |
| `GET /client/register`          | Client registration form |

---

## Available Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `bun run dev`         | Start dev server with hot reload    |
| `bun run build`       | Build to `./dist`                   |
| `bun run db:up`       | Start PostgreSQL via Docker Compose |
| `bun run db:down`     | Stop PostgreSQL container           |
| `bun run db:generate` | Generate Drizzle migration files    |
| `bun run db:migrate`  | Apply migrations to the database    |
| `bun run studio`      | Open Drizzle Studio (DB GUI)        |
| `bun run commit`      | Commit with Commitizen              |

---

## Development

### Git Hooks (Husky)

- **pre-commit** — runs linting / formatting checks
- **commit-msg** — validates commit message format (Conventional Commits)

### Commit convention

```
feat: add refresh token rotation
fix: handle expired authorization codes
chore: update drizzle-orm to 0.45
```

Use `bun run commit` to get an interactive prompt.
