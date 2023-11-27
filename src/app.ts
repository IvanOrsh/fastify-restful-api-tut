import { fastify, type FastifyServerOptions } from "fastify";

const serverOptions: FastifyServerOptions = {
  logger: true,
};

const server = fastify(serverOptions);

server.get("/healthcheck", async function () {
  return {
    status: "OK",
  };
});

server.addHook("onReady", () => {
  console.log("onReady");
});

void (async function main(): Promise<void> {
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
