import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return c.json({ error: "No token provided" }, 401);

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return c.json({ error: "Invalid token format" }, 401);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    c.set("user", payload);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
};
