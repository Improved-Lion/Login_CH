// src/types/express.d.ts

import { User } from "../models/userModel";

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
      userEmail?: string;
      userType?: string;
    }
  }
}
