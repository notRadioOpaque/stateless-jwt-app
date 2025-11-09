import { Hono } from "hono";
import { db } from "../db";
import { users as usersSchema } from "../db/schema";
import { authMiddleware } from "../middleware";

const users = new Hono();

users.use("*", authMiddleware);

users.get("/", async (c) => {
  const persistedUsers = await db.select().from(usersSchema);

  // strip out passwordHash and other sensitive data before sending to the client...
  const safeUsers = persistedUsers.map(({ passwordHash, ...rest }) => rest);

  return c.json({ data: safeUsers });
});

export default users;
