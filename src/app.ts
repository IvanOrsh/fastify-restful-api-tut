import {
  fastify,
  type FastifyServerOptions,
  type FastifyRequest,
  type FastifyReply,
} from "fastify";
import fjwt from "@fastify/jwt";

import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const serverOptions: FastifyServerOptions = {
  logger: true,
};

const server = fastify(serverOptions);

// plugins
server.register(fjwt, {
  secret: "fjdklsjdf djfglcmlt39",
});

// decorators
server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return await reply.send(e);
    }
  }
);

server.get("/healthcheck", async function () {
  return {
    status: "OK",
  };
});

void (async function main(): Promise<void> {
  // add schemas before registering routes
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, {
    prefix: "/api/users",
  });

  try {
    const address = await server.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log(`Server listening on ${address}`);
  } catch (e) {
    console.error(e);
    process.exit(2);
  }
})();
