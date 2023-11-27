import { type FastifyInstance } from "fastify";

import registerUserHandler from "./user.controller";

async function userRoutes(server: FastifyInstance): Promise<void> {
  server.post("/", registerUserHandler);
}

export default userRoutes;
