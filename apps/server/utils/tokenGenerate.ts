import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_ACCESS_TOKEN } from "../utils/Secret";

export async function GenerateAccessToken(userId: string): Promise<string> {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN || JWT_ACCESS_TOKEN,
    {
      expiresIn: "1h",
    }
  );
}

export async function GenerateRefressToken(userId: string): Promise<string> {
  return jwt.sign({ userId }, process.env.JWT_SECRET || JWT_SECRET, {
    expiresIn: "15d",
  });
}
