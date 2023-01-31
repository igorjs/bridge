<div align="center">
  <a href="https://bridge.codes">
      <img src="https://bridge.codes/img/logo_b_round.svg" height="120" />
  </a>
</div>
  
<div align="center">

 <a href="https://twitter.com/bridge_codes">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40bridge_codes&style=social&url=https%3A%2F%2Ftwitter.com%2Falexdotjs" />
  </a>
  <a href="https://discord.gg/ZCw645JV"> 
    <img alt="Discord" src="https://img.shields.io/discord/1050622016673288282?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://github.com/trpc/trpc/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/trpc/trpc" />
  </a>
</div>

# Bridge

Bridge is the most straightforward yet powerful framework for creating simple or complex APIs using the full power of TypeScript, even for developers with little experience. Give it a try and see how easy it is to build your dream API!

<!-- [Try it live](https://stackblitz.com/edit/github-vuwsnn?file=index.ts&view=editor) -->

<!-- **👉 See more informations on [bridge.codes](https://bridge.codes) 👈** -->

## Documentation

Full documentation for `bridge` can be found [here](https://bridge.codes).

## Installation

```bash
# npm
npm install bridge
# Yarn
yarn add bridge
# pnpm
pnpm add bridge
```

## Quickstart

```bash
# npm
npx create-bridge-app@latest
# Yarn
yarn create bridge-app
# pnpm
pnpm create bridge-app
```

## Basic Example

```ts
import { initBridge, handler } from 'bridge';
import express from 'express';
// You can also use Yup or Superstruct for data validation
import z from 'zod';

const port = 8080;

// A handler can be used as an endpoint but also as a middleware
const heyHandler = handler({
  query: z.object({ name: z.string() }),
  resolve: ({ query }) => `Hey ${query.name}`,
});

// You can also have multiple endpoints for the same route with different methods with the method function
const routes = {
  hey: heyHandler, // POST /hey
};

// It is also possible to use pure HTTP Server
const app = express();

app.use('', initBridge({ routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

For more complex examples and a full understanding of the capabilities of Bridge, be sure to check out our [documentation](https://bridge.codes)!

<!--
### Table of Contents

- [Bridge](#bridge)
  - [Installations](#installations)
    - [Table of Contents](#table-of-contents)
  - [Quickstart](#quickstart)
    - [Using create-bridge-app](#using-create-bridge-app)
    - [Manual setup with Express](#manual-setup-with-express)
  - [Init Bridge](#init-bridge)
  - [Routing](#routing)
    - [Nested routes](#nested-routes)
  - [Handler](#handler)
    - [Data validation](#data-validation)
    - [Type inference](#type-inference)
  - [Middleware](#middleware)
    - [Multiple middlewares](#multiple-middlewares)
  - [Error handling](#error-handling)
    - [Send an HTTP error](#send-an-http-error)
    - [Monitor errors](#monitor-errors)
  - [Files](#files)
  - [Client generation](#client-generation)

## Quickstart

There are a few [examples](https://github.com/bridge-codes/bridge/tree/main/examples) that you can use for playing out with Bridge or start your new project.

### Using create-bridge-app

The easiest way to start a Bridge project is by using `create-bridge-app`. It will initialize a project and install all required dependencies. Open your terminal, go into the directory you’d like to create the app in, and run the following command:

```
npx create-bridge-app
```

When the installation is done, you can run the project using the default settings with the following command:

```
npm run build && npm run start
```

This builds and starts your Bridge "server" on port **8080**.

### Manual setup with Express

Init your project and install all required dependencies.

```
npm init
npm i bridge express
npm i typescript @types/express --save-dev
```

Create an index.ts file.

```ts
import { handler, initBridge } from 'bridge';
import express from 'express';

const port = 8080;

const helloHandler = handler({ method: 'GET', resolve: () => 'hello' });

const routes = {
  hello: helloHandler,
};

const app = express();

app.use('', initBridge({ routes: routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

## Init Bridge

First you will need to initialize bridge app. You can either use it with **express** or with **HTTPServer**. This will make your Bridge endpoints available.

**If you use express**

```ts
import { handler, initBridge } from 'bridge';
import express from 'express';

const port = 8080;
const routes = {
  hello: handler({
    method: 'GET',
    resolve: () => 'hello',
  }),
};

const app = express();

app.use('', initBridge({ routes: routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

**With HTTPServer**

```ts
import { handler, initBridge } from 'bridge';

const port = 8080;
const routes = { hello: handler({ method: 'GET', resolve: () => 'hello' }) };

initBridge({ routes })
  .HTTPServer()
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
```

## Routing

[Handlers](#handler) themselves cannot be be directly called. They have to be added to an object that we call `router` and this object has to be passed to the `initBridge function`.

The keys in your `router` object are the different endpoints of your API while the values associated with those keys and the values are the `handlers` that will be executed when a request is made to the corresponding endpoint.

**Example**

```ts
import { handler } from 'bridge';

const helloHandler = handler({
  method: 'GET',
  resolve: () => {
    return 'Hello';
  },
});

const byeHandler = handler({
  // default method is POST
  resolve: () => {
    return 'Bye';
  },
});

const routes = {
  // GET /hello
  hello: myFirstHandler,
  // POST /bye
  bye: byeHandler,
};
```

Don't forget to pass the router as a param to the `initBridge` function as seen in [initBridge](#init-bridge).

### Nested routes

In addition to defining individual routes, you can also create nested routes by adding new objects to your router.

Nested routes allow you to create more complex and organized APIs by grouping related routes together.

```tsx
const routes = {
  admin: {
    users: {
      // POST /admin/users/create
      create: createUserHandler,
      // POST /admin/users/get
      get: getUserHandler,
      // POST /admin/users/update
      update: updateUserHandler,
    },
  },
};
```

## Handler

Bridge provides the **handler**. It it a function responsible for several things:

- Validate data coming from the client
- If an errors occurs or the request is invalid, notify the client
- Return a response to the client

**Basic example**

```ts twoslash
import { handler } from 'bridge';

const myFirstHandler = handler({
  method: 'GET',
  resolve: () => {
    const response = { response: 'Hello World' };
    return response;
  },
});
```

### Data validation

The validation is done using the [zod library](https://github.com/colinhacks/zod). Other libraries like superstruct or yup are also supported. Make sure you have zod installed:

```
npm install zod
```

You can validate the `body`, `headers` and `query` of each requet using zod. If the request doesn't meet the validation criteria, a **422** error is automatically sent to the client. The response sent will explain where the validation failed.

**The validation takes this form**

```ts
const userHandler = handler({
  // ...
  body: z.object({
    name: z.string(),
    age: z.number(),
    // the body can contain objects, dates, strings, numbers, arrays, ...
  }),
  query: z.object({
    // the query can only contain string validation as value
    param1: z.string(),
    param2: z.string(),
    // ...
  }),
  headers: z.object({
    haeder1: z.string(),
    header2: z.string(),
    // the headers can only contain string validation
  }),
  resolve: ({ body, query, headers }) => {
    //...
  },
});
```

**Here is an example:**

```ts
// You can use either zod, yup or superstruct
import z from 'zod';
import { handler } from 'bridge';

const hello = handler({
  query: z.object({ name: z.string().optional() }),
  body: z.object({ age: z.number() }),
  headers: z.object({ token: z.string().min(6) }),
  resolve: ({ query, body, headers }) => `Hello ${query.name}`,
});
```

### Type inference

The types of the validated query, body and headers as long as the return of the middlewares are automatically infered. You can use these objects inside the **resolve** function of the handler.

## Middleware

A middleware is handler that is called before the resolve function of the main handler of the called endpoint. Creating a middleware is just as simple as creating a handler. In fact, it is a handler which means that the middleware can perform the exact same tasks.

The return of the middleware is returned into the `mid` object of the resolve function of the main handler. Its type is infered. If a middleware returns an **httpError**, it sends an error the the client and the resolve function of the main handler is not executed anymore.

Middlewares can also have **query**, **headers** and **body** validation.

**Example**

```ts
import z from 'zod';
import { apply, handler } from 'bridge';

const authMiddleware = handler({
  headers: z.object({ token: z.string().min(5) }),
  resolve: ({ headers }) => {
    if (headers.token !== 'private_token') return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return { firstName: 'John', name: 'Doe', age: 21 };
  },
});

const updateUser = handler({
  middlewares: apply(authMiddleware),
  body: z.object({ age: z.number() }),
  resolve: ({ mid, body }) => {
    const user = mid;
    user.age = body.age;
    return user;
  },
});
```

### Multiple middlewares

Multiple middleware can be added to a handler.

```ts
import { handler, apply } from 'bridge';

const exampleHandler = handler({
  middlewares: apply(mid1, mid2, mid3),
  resolve: ({ mid }) => {
    // ...
  },
});
```

Multiple middlewares are executed in parellel. All their returns are merged into the `mid` object of the main handler. For this reason, it is important that middleware return javascript objects.

If you want to have middlewares running sequencially, you have to add a middleware to you middleware.

**Example**

```ts
const mid1 = handler({
  resolve: () => {
    console.log('1');
  },
});

const mid2 = handler({
  middlewares: apply(mid1),
  resolve: () => {
    console.log('2');
  },
});

const mainHandler = handler({
  middlewares: apply(mid2),
  resolve: () => {
    console.log('3');
  },
});
```

The console ouput will be:

```
1
2
3
```

## Error handling

Bridge has 2 ways of sending errors:

- Data validation errors
- Manual triggered errors

The first method is managed by **zod**, superstruct or yup while the second one has to be written manually.

### Send an HTTP error

```ts
import { httpError, StatusCode } from "bridge";

const getMe: handler({
  headers: z.object({ token: z.string().min(6) }),
  resolve: ({ headers }) => {
    if (headers.token !== "private_token") return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return {
      firstName: 'John',
      lastName: 'Doe',
    }
  },
}),
```

### Monitor errors

```ts
import { initBridge, onError } from 'bridge';
const errorHandler = onError(({ error, path }) => {
  if (error.name === 'Internal server error') console.log(path, error); // Send to bug reporting
  else console.log(path, error.status, error.name);
});

const bridge = initBridge({ routes, errorHandler });
```

## Files

To do.

## Client generation

To do. -->
