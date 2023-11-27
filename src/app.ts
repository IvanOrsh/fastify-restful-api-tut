import { fastify, type FastifyServerOptions } from "fastify";
import userRoutes from "./modules/user/user.route";

const serverOptions: FastifyServerOptions = {
  logger: true,
};

const server = fastify(serverOptions);

server.get("/healthcheck", async function () {
  return {
    status: "OK",
  };
});

void (async function main(): Promise<void> {
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
