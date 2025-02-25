import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./Secret";

export function decodeToken(token: string): string {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || JWT_SECRET
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token payload");
    }

    return decoded.userId;
  } catch (error) {
    console.error("Token decoding error:", error);
    throw new Error("Invalid or expired token");
  }
}
