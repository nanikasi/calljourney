import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    res: "こんにちは！このページは１日10万リクエストまで耐えるよ！",
  });
});

export default app;
