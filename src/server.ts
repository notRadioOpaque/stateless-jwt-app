import { Hono } from "hono";
import auth from "./routes/auth";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);

export default app;
