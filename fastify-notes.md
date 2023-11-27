# 1. What is Fastify?

## 1.1 Overview

Fastify is a Node.js web framework used to build server applications.

Focuses on:

- Improving of the developer experience. (plugin design system)
- Comprehensive performance: Fastify is built to be the fastest.
- Up to date with the evolution of the Node.js runtime.
- Ready to use: Fastify helps to set up the most common issues we may face during the implementation. (application logging, security concerns, automatic test implementation, user input parsing, etc.)
- Community driven.

## 1.2 Fastify Components

- The **root application instance** represents the Fastify API at you disposal. It \*\*manages and controls the standard Node.js `http.Server` class and sets all the endpoints and the default behavior for every request and response.

- A **plugin instance** is a child object of the application instance, which shares the same interface. It **isolates itself from other sibling plugins to let you build independent components that can't modify other contexts**.

- The `Request` object is a wrapper of the standard Node.js `http.IncomingMessage` that is created for every client's call. It eases access to the user input and adds functional capabilities such as logging and client metadata.

- The `Reply` object is a wrapper of the standard Node.js `http.ServerResponse` and facilitates sending a response back to the user.

---

**Utility components**:

- The **hook** functions that act, when needed, during the lifecycle of the application or a single request and response.
- The **decorators**, which let you augment the features installed by default on the main components, avoiding code duplication.
- The **parsers**, which are responsible for the request's payload conversion to a primitive type

## 1.3 Start server with `fastify`

```ts
import { fastify, type FastifyServerOptions } from "fastify";

const serverOptions: FastifyServerOptions = {
  logger: true,
};

const server = fastify(serverOptions);

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
```

## 1.4 Lifecycles and hooks overview

Fastify implements 2 systems that regulate its internal workflow:

1. the **application lifecycle**
2. the **request lifecycle**

These two lifecylces trigger a large set of events during the application's lifetime.

### 1.4.1 Application lifecycle

The application lifecycle tracks the status of the application instance and triggers this set of events:

- the `onRoute` event acts when you add an endpoint to the server instance;
- the `onRegister` event is unique as it performs when a new **encapsulated context** is created;
- the `onReady` event runs when the application is ready to start listening for incoming HTTP request;
- the `onClose` event executes when the server is stopping.

All these events are Fastify's hooks. ( a function that runs whenever a specific event happens in the system is a **hook**)
The hooks that listen for application lifecycle events are called **application hooks**. They can \*\*intercept and control the application server boot phases, which involve:

- The routes' and plugins' initialization
- The application's start and close

```js
app.addHook("onRoute", function inspector(routeOptions) {
  console.log(routeOptions);
});
app.addHook("onRegister", function inspector(plugin, pluginOptions) {
  console.log("Chapter 2, Plugin System and Boot Process");
});
app.addHook("onReady", function preLoading(done) {
  console.log("onReady");
  done();
});
app.addHook("onClose", function manageClose(done) {
  console.log("onClose");
  done();
});
```

application lifecyle

```txt

      start application event
        |
      Starting ---> onRoute's hook queue
        |     |
        |      ---> onRegister's hook queue
        |
      onReady's hooks executions
        |
startup-  -server listening
failed          |
          stop application event
                |
             closing
                |
        onClose's hooks executions
                |
             Stopped

```

### 1.4.2 Request lifecycle

The request lifecycle has a lot more events.

The hooks listening to the request's lifecycle are **request and reply hooks**. This lifecycle defines the flow of every HTTP request that your server will receive.

The server will process the request in two phases:

- The **routing**: This step must find the function that must evaluate the request.
- The **handling** of the request performs a set of events that compose the request lifecycle.
