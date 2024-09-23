import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { reserveFail } from "../../../usecase/reserve-fail";
import type { Bindings, VariablesType } from "../entrypoint";

const schema = createRoute({
  method: "post",
  path: "/reserve-fail",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            reservationID: z.string().openapi({
              example: "",
              description: "reservation id",
            }),
          }),
        },
      },
    },
  },
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

  await reserveFail(
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
