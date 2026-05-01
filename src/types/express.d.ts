import "express";

declare module "express" {
  interface Request {
    clientInfo?: {
      clientTableEntryId: string;
      clientId: string;
    };
  }
}
