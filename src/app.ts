import {
  fastify,
  type FastifyServerOptions,
  type FastifyInstance,
  type FastifyRequest,
  type FastifyReply,
} from "fastify";
import fjwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";

import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import productRoutes from "./modules/products/product.route";
import { productSchemas } from "./modules/products/product.schema";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      id: number;
      email: string;
    };
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

  app.register(
    swagger,
    withRefResolver({
      swagger: {
        info: {
          title: "Fastify RESTful API Tutorial",
          version: "1.0.0",
        },
        // schemes: ["http"],
        // consumes: ["application/json"],
        // produces: ["application/json"],
        // tags: [
        //   {
        //     name: "users",
        //     description: "Operations about users",
        //   },
        //   {
        //     name: "products",
        //     description: "Operations about products",
        //   },
        // ],
      },
    })
  );

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
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
  app.register(productRoutes, {
    prefix: "/api/products",
  });

  return await app;
}

export { buildApp };
