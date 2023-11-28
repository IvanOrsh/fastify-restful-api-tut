import {
  fastify,
  type FastifyServerOptions,
  type FastifyInstance,
  type FastifyRequest,
  type FastifyReply,
} from "fastify";
import fjwt from "@fastify/jwt";

import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/products/product.schema";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const app = fastify(options);

  app.get("/healthcheck", async function () {
    return {
      status: "OK",
    };
  });

  // plugins
  app.register(fjwt, {
    secret: "fjdklsjdf djfglcmlt39",
  });

  // decorators
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        return await reply.send(e);
      }
    }
  );

  // add schemas before registering routes
  for (const schema of [...userSchemas, ...productSchemas]) {
    app.addSchema(schema);
  }

  app.register(userRoutes, {
    prefix: "/api/users",
  });

  return await app;
}

export { buildApp };
