import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { reserveSuccess } from "../../../usecase/reserve-success";
import type { Bindings, VariablesType } from "../entrypoint";
import { twilioAuthMiddleware } from "../middleware/twilio-auth-middleware";

const schema = createRoute({
  method: "post",
  path: "/reserve-success",
  request: {
    headers: z.object({
      "X-Twilio-Signature": z
        .string()
        .min(1, "X-Twilio-Signature header is required"),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            reservationID: z.string().openapi({
              example: "",
              description: "unieqe id",
            }),
          }),
        },
      },
    },
  },
  middleware: [twilioAuthMiddleware],
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({}),
        },
      },
      description: "return response on success",
    },
  },
});

const route = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: VariablesType;
}>();

route.openapi(schema, async (c) => {
  const reservationID = c.req.valid("json").reservationID;

  const di = c.get("diContainer");

  const output = await reserveSuccess(
    {
      userRepository: di.get("UserRepository"),
      reservationRepository: di.get("ReservationRepository"),
    },
    {
      mailService: di.get("MailService"),
    },
    {
      reservationID,
    },
  );
  return c.json({});
});

export default route;
