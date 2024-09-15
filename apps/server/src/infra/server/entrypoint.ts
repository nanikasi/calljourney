import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import type { ReservationRepository } from "../../domain/repository/reservation-repository";
import type { UserRepository } from "../../domain/repository/user-repository";
import type { CallService } from "../../service/call-service";
import type { MailService } from "../../service/mail-service";
import { D1ReservationRepositoryImpl } from "../repository/d1-reservation-repository";
import { D1UserRepositoryImpl } from "../repository/d1-user-repository";
import { CallServiceImpl } from "../service/call-service-impl";
import { MailServiceImpl } from "../service/mail-service-impl";
import { DIContainer } from "./di-container";
import reservePostRoute from "./route/reserve.post";

export type Bindings = {
  DB: D1Database;
  WEB_URL: string;
  TWILIO_API_URL: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
};

export type VariablesType = {
  diContainer: DIContainer<DependencyTypes>;
};

export interface DependencyTypes {
  UserRepository: UserRepository;
  ReservationRepository: ReservationRepository;
  CallService: CallService;
  MailService: MailService;
}

const app = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: VariablesType;
}>();

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.WEB_URL,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  });

  await corsMiddleware(c, next);
});

app
  .doc("/schema", {
    openapi: "3.0.0",
    info: { version: "1.0.0", title: "calljourney-server" },
  })
  .use("*", (c, next) => {
    const diContainer = new DIContainer<DependencyTypes>();
    diContainer.register("UserRepository", new D1UserRepositoryImpl(c.env.DB));
    diContainer.register(
      "ReservationRepository",
      new D1ReservationRepositoryImpl(c.env.DB),
    );
    diContainer.register(
      "CallService",
      new CallServiceImpl(
        c.env.TWILIO_API_URL,
        c.env.TWILIO_ACCOUNT_SID,
        c.env.TWILIO_AUTH_TOKEN,
        c.env.TWILIO_PHONE_NUMBER,
      ),
    );
    diContainer.register("MailService", MailServiceImpl);
    c.set("diContainer", diContainer);
    return next();
  })
  .get("/ui", swaggerUI({ url: "schema" }))
  .route("/", reservePostRoute);

export default app;
