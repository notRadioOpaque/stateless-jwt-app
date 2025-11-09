import { Hono } from "hono";
import auth from "./routes/auth";
import users from "./routes/users";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);
app.route("/users", users);

export default app;
