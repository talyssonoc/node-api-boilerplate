process.env.NODE_ENV = 'test';

const catchAll = new Proxy(
  {},
  {
    get: () => {
      return jest.fn().mockReturnValue(catchAll);
    },
  }
);

jest.mock('pino', () => () => catchAll);

console = catchAll;
