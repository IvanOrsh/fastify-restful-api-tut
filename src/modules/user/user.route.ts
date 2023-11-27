import { type FastifyInstance } from "fastify";

import registerUserHandler from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance): Promise<void> {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );
}

export default userRoutes;
