//express.d.ts
import { UserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Extending Request with user property
    }
  }
}
