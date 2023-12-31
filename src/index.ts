import { buildApp, type AppOptions } from "./app";

let serverOptions: AppOptions = {
  logger: {
    level: "info",
  },
};

if (process.stdout.isTTY) {
  serverOptions = {
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    },
  };
}

void (async function main(): Promise<void> {
  const app = await buildApp(serverOptions);

  try {
    const address = await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log(`Server listening on ${address}`);
  } catch (e) {
    console.error(e);
    process.exit(2);
  }
})();
