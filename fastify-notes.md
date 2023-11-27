- [1. What is Fastify?](#1-what-is-fastify)
  - [1.1 Overview](#11-overview)
  - [1.2 Fastify Components](#12-fastify-components)
  - [1.3 Start server with `fastify`](#13-start-server-with-fastify)
  - [1.4 Lifecycles and hooks overview](#14-lifecycles-and-hooks-overview)
    - [1.4.1 Application lifecycle](#141-application-lifecycle)
    - [1.4.2 Request lifecycle](#142-request-lifecycle)
  - [1.5 The Root Application Instance](#15-the-root-application-instance)
    - [1.5.1 Server options](#151-server-options)
    - [1.5.2 Application instance properties](#152-application-instance-properties)

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

The request triggers these events in order during its handling:

1. `onRequest`: The server receives an HTTP request and routes it to a valid endpoint. Now, the request is ready to be processed.
2. `preParsing` happens before the evaluation of the request’s body payload.
3. The `preValidation` hook runs before applying **JSON Schema validation** to the request’s parts. Schema validation is an essential step of every route because it protects you from a malicious request payload that aims to leak your system data or attack your server.
4. `preHandler` executes before the endpoint handler.
5. `preSerialization` takes action before the response payload transformation to a String, a Buffer, or a Stream, in order to be sent to the client.
6. `onError` is executed only if an error happens during the request lifecycle.
7. `onSend` is the last chance to manipulate the response payload before sending it to the client.
8. `onResponse` runs after the HTTP request has been served.

## 1.5 The Root Application Instance

The root application instance is the main API you need to create. All the functions controlling the incoming client's request must be registered to it, and this provides a set of helpers that let you best organize the application.

### 1.5.1 Server options

- `logger`
- `https: object` sets up the server to listen for **Transport Layer Security** (TLS) sockets.
- `keepAliveTimeout`, `connectionTimeout`, `http2SessionTimeout` are several timeout parameters after which the HTTP request socket will be destroyed, releasing the server resources. (these params are forwarded to the standard Node.js `http.Server`)
- Routing customization to provide stricter or laxer constraints—for instance, a case-insensitive URL and more granular control to route a request to a handler based on additional information, such as a request header instead of an HTTP method and HTTP URL.
- `maxParamLength: number<length>` limits the path parameter string length.
- `bodyLimit: number<byte>` caps the request body payload size.
- `http2: boolean` starts an HTTP2 server, which is useful to create a long-lived connection that optimizes the exchange of data between client and server.
- The `ajv` parameter tweaks the validation defaults to improve the fit of your setup.
- The `serverFactory`: function manages the low-level HTTP server that is created. This feature is a blessing when working in a serverless environment.
- The `onProtoPoisoning` and `onConstructorPoisoning` default security settings are the most conservative and provide you with an application that's secure by default. Changing them is risky and you should consider all the security issues because it impacts the default
  request body parser and can lead to code injection.

### 1.5.2 Application instance properties
