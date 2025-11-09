import { Hono } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

import jwt, { Secret, SignOptions } from "jsonwebtoken";

config({ path: ".env.local" });

interface JwtPayload {
  userId: string;
  email: string;
}

type StringValue = `${number}H`;

const auth = new Hono();

auth.post("/register", async (c) => {
  const { email, password } = await c.req.json();

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length) return c.json({ error: "User already exists" }, 400);

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();

  return c.json({ message: "Registered" });
});

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return c.json({ error: "Invalid credentials" }, 401);

  const payload: JwtPayload = {
    userId: user.id.toString(),
    email: user.email,
  };

  const secret = process.env.JWT_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
  };

  const token = jwt.sign(payload, secret, options);

  return c.json({ token });
});
