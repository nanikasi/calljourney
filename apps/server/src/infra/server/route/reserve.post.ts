import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { reserve } from "../../../usecase/reserve";
import type { Bindings, VariablesType } from "../entrypoint";

const schema = createRoute({
  method: "post",
  path: "/reserve",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().openapi({
              example: "",
              description: "name",
            }),
            email: z.string().min(1).openapi({
              example: "",
              description: "email",
            }),
            phone: z.string().min(1).openapi({
              example: "",
              description: "phone",
            }),
            restaurantPhone: z.string().min(1).openapi({
              example: "",
              description: "restaurantPhone",
            }),
            time: z.string().min(1).openapi({
              example: "",
              description: "time",
            }),
            customerCount: z.coerce.number().min(1).openapi({
              example: 1,
              description: "customerCount",
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
          schema: z.object({
            id: z.string().min(1).openapi({
              example: "success-id",
              description: "ID",
            }),
          }),
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
  const name = c.req.valid("json").name;
  const email = c.req.valid("json").email;
  const phone = c.req.valid("json").phone;
  const restaurantPhone = c.req.valid("json").restaurantPhone;
  const time = c.req.valid("json").time;
  const customerCount = c.req.valid("json").customerCount;

  const di = c.get("diContainer");

  const output = await reserve(
    {
      userRepository: di.get("UserRepository"),
      reservationRepository: di.get("ReservationRepository"),
    },
    {
      callService: di.get("CallService"),
    },
    {
      name: name,
      phone: phone,
      email: email,
      restaurantPhone: restaurantPhone,
      time: time,
      customerCount: customerCount,
    },
  );
  return c.json({
    id: output.id,
  });
});

export default route;
