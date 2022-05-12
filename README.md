# What is it

This project is a starting point for you to develop a web API in a scalable way with Node and TypeScript, and was implemented following ideas from layered architecture, Clean Architecture, and Domain-Driven Design. While it contains an opinionated design and structure, it was built to be extensible and flexible so you can modify and adapt it according to your team's needs and preferences.

This version of the boilerplate is still in beta, so might contain abstractions that will change or be missing features. Contribution from the community, either through PRs or is welcome.

**Important** This is the documentation for the v3 of the boilerplate. Click here if you want the [docs for the v2.1](https://github.com/talyssonoc/node-api-boilerplate/tree/v2.1).

# Usage

## How to run the server

### Requisites
* To run the project wit Docker you need to have Docker installed in your computer: [Docker](https://docs.docker.com/engine/install/)
* To run locally you need to have project dependencies installed globally in your machine

During development, the project can be run in two different ways.

### With Docker

If you want to just run the application in development mode, use the following command:

```sh
$ docker compose up
```

To run the application in debug mode in a way that the execution will stop when a debugger statement is called, use:

```sh
$ docker-compose -f docker-compose.yaml -f docker-compose.debug.yaml up
```

### Locally

If you want to just run the application in development mode, use the following command:
```sh
$ yarn dev
```

To run the application in debug mode in a way that the execution will stop when a debugger statement is called, use:

```sh
$ yarn debug
```

## How to run the application console

You can also run the application in console mode, giving you programmatic access to the environment, this can also be done in two different ways.

To run a new instance, isolated from the server, use the following command:

```sh
$ yarn cli
```

For the new instance, you're able to access the dependencies registered in the container using `registry.<dependencyName>` or through the `container` variable.

But if you're already running the server (this is a requirement) and you want to a console connected to the process of the server, giving you access to the current state of it, use:

```sh
$ yarn remote [server address] [REPL port]
```

## Tests

The boilerplate is prepared to run tests using Jest. We usually group the tests in folders called `__tests__` (following Jest convention) for each module of the application. To run the tests use the following commands:

### With Docker
```sh
$ docker compose up

$ yarn test
```

### Locally
```sh
$ yarn dev

$ yarn test
```

## Dependency injection

We use [Awilix](https://www.npmjs.com/package/awilix) to implement dependency injection and decouple the parts of your application. The boilerplate was developed in a way that each [module](#modules) is able to consume and augment the registered dependencies separately. Click here to know more about [inversion of control and dependency injection](https://www.martinfowler.com/articles/injection.html). The creator of Awilix also has a very good series of posts about the design decisions of the library that you can read [clicking here](https://medium.com/@Jeffijoe/dependency-injection-in-node-js-2016-edition-f2a88efdd427).

The instance of the Awilix dependency container is created in the file `src/container.ts`. You'll notice that the type of the dependencies is defined by combining the types of the dependencies exported by each of the modules. After that, each of these modules will be then responsible for registering those dependencies in the container during the [boot process](#boot).

## Import paths

In order to make it easier and cleaner to import files we use [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) configured to alias the path to the `src/` folder as `@`. For example, if you want to import the file `src/article/domain/Article.ts`, you can do it through the path `@/article/domain/Article.ts` no matter from which file you are importing it.

## Modules

The codebase is divided into modules, where each module can represent either an integration (with some HTTP or database library, for example) or a feature (that are called here as app modules). Each module requires to be given a name and has access to the configuration options, the logger, the [lifecycle events](#lifecycle-events) and the the context of the application in order to add and use dependencies from the container. More technical details about the modules will be given in a [separate section](#module-internals).

## Logging

We use [Pino](https://www.npmjs.com/package/pino) for effective and high performance logging. The instance of the logger is available in the dependency injection container to be used across the board and also is one of the arguments of the module constructor.

## Recommended patterns

This boilerplate follows ideas from multiple good software development practices sources like [layered architecture](http://wiki.c2.com/?FourLayerArchitecture), [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), [Domain-Driven Design](https://www.domainlanguage.com/ddd/), among others. As such, even though it's not required, there are some patterns that are recommended and suggested that work well with the principles that make the boilerplate scalable and extensible. To mention some:

- We recommend the usage of entities, aggregates and value objects, and other patterns that are used to isolate domain-specific code from the rest of the application code, as mentioned in Domain-Driven Design. To create a standard and practical way to define invariants for entities and aggregates there is a function that can be imported from the [lib](#lib-and-shared-kernel) called `withInvariants`. Click here to read a brief [reference about Domain-Driven Design](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf).
- To abstract the persistence layer of your application we recommend the usage of the [repository pattern](https://martinfowler.com/eaaCatalog/repository.html). An important fact to take note is that even though the example app in the boilerplate used Mongo, you're not required to use it in your application, you just need to create a module to connect to the database of your preference and implement repositories that communicate with this database
- To favor a more predictable and explicit definition of domain rules we favor immutable objects and pure functions to define business rules rather than classes. You'll see that most of the code does not expose classes to be used.
- To export and import domain-specific code we use [TypeScript namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html). We believe it helps in making the code that is imported from the domain easier to read since it will always be prefixed by the name of the context it concerns about, loosely inspired by [Elixir modules](https://elixir-lang.org/getting-started/modules-and-functions.html). We follow the pattern of adding a named export called Type to expose the entity/aggregate/value object from that given file.

## Going to production

To run your app in production mode, you'll need to follow these steps:

### With Docker

1. Define any environment variable important for production
2. Go to `docker-compose.production.yaml` file, and add necessary configurations
3. Run the following command:
```sh
$ docker-compose -f docker-compose.yaml -f docker-compose.production.yaml up
```

### Locally

1. Build the application with `yarn build`
2. Define any environment variable important for production
3. Start the app with `yarn start`

# How it works

## Context

The base of an application built with the boilerplate is the context instance. The context, defined in `src/_lib/Context.ts` and instantiated in `src/context.ts`, is what makes all the parts talk to each other and what defines what will be exposed to the modules during their creation, which can be customized by changing the object that is passed to the `makeContext` function in `src/context.ts`. Every module that is defined using the function `makeModule` provided by the same context is able to communicate with each other.

It's important to mention that you are able to have multiple isolated contexts in the same codebase in case you want to have more than one application, they will have isolated dependency containers, modules and will run separately. The context implementation will ensure that modules from different contexts are isolated, so you should not try to plug a module from a given context into a different context's `bootstrap` function.

## Module internals

Modules are the building pieces of an application built with this boilerplate. You can either encapsulate an integration or a feature using a module or any other division you think makes sense for your application. During the boot process of the application, all the modules will be imported and run in the order they are passed to the bootstrap function in `src/_boot/index.ts`, this order is important because it can influence how a module will depend on another module and in the cleanup process when the app is stopped. When run, a module is able to access the configuration options of the application, the dependency injection container, and register to subsequent [lifecycle events](#lifecycle-events) of the boot process. If some cleanup logic is needed to be run for a module during the stopping process of the application, the module must return a function that implements this logic, similar to [how React implements the cleanup of effects](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup).

Module constructors should be used mostly as simple glue between the integration or feature implementation and the application, prefer to put the actual implementation of the logic inside the `_lib/` folder (like database module does with `MongoProvider`) or a feature folder inside `src/` (like we do for the article module) accordingly.

## Lib and shared kernel

Besides the feature folders that go inside `src/`, we also separate abstractions that will be used across the codebase in the `_lib/` and `_sharedKernel/` folders. Inside `_lib/` we usually put code that is not specific to our application, code that could be easily extracted to a npm package if necessary, like abstractions around other packages, reusable generic types and the such. For application-specific reusable logic between multiple modules we use the `_sharedKernel/` folder. To understand more about what the shared kernel is, we recommend reading the [DDD quick reference](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf) section about it.

## Boot

The boot process consists of setting up all the necessary code for the application to run, including running the modules and going through the [lifecycle events](#lifecycle-events). The files used during the boot process are all inside the `_boot/` folder, including the definition of the integration modules, but the abstractions created for this, like the context, are imported from the [lib](#lib-and-shared-kernel). To understand more about the booting process begin looking into the `src/context.ts` file and then the `src/_boot/index.ts` file.

## Lifecycle events

Both the boot and stopping processes are defined as a sequence of lifecycle events. These events exist in order to make these processes explicit and allow the modules to hook into them to properly integrate them into the application execution. Here's the order of lifecycle events for the boot and the stopping processes, we're gonna cover how to hook into an event in the next section.

Boot:

1. Booting:

- The booting event is dispatched once the function bootstrap is called in `src/_boot/index.ts`
- The modules are invoked during this lifecycle step, so by the time each module is invoked this lifecycle event was already dispatched
- It's not possible for a module to hook into this event because it's run by the context to declare that the boot process is started
- Mostly for internal usage to prepare the rest of the boot process

2. Booted:

- When this event is dispatched it's a message to let the modules know that all the modules were already invoked and had already hooked into the other lifecycle events
- This is a good place to register error handlers because every module has already registered its routes when they were invoked
- Use this event to do anything you might need after all the module constructors are done running

3. Ready:

- This lifecycle event happens after all the listeners for the booted event were run
- This is the proper place to actually start things, like starting the server, make queue consumers start listening to messages, or waiting for commands in case the app is running in REPL mode

4. Running:

- After everything from the ready event is done, the app is now actually running
- A good usage for this lifecycle event is to know if the app is already prepared to be accessed during the setup of an automated test or offer info about the process in the console

Stopping

1. Disposing

- It's during this lifecycle event that the cleanup functions returned by the modules will be run
- To make the cleanup process consistent, the cleanup functions are run in the inverse order their modules were passed to the bootstrap function. So if your app uses `bootstrap(database, server)`, during the disposing process the cleanup function of the server module will be called first and then the database one.
- As an example, this is where the server is stopped and the database connections are closed
- It's intended to be used to revert everything initialized during Booting lifecycle event

2. Disposed

- By the time Disposed event is dispatched, we expect that everything that keeps the process open is already finished, leaving it in a safe state to be terminated
- You could use this event to clean temporary files, for instance

3. The application should now be completely stopped and the process is terminated

To be able to hook into lifecycle events, access the property `app` in the object passed to the constructor of the modules. The `app` object contains a function for each lifecycle, prefixing it with the word `on`. So, for example, to hook into the Booted event, call `app.onBooted(callback)`.
