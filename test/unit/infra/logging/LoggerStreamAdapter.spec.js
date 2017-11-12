const LoggerStreamAdapter = require('src/infra/logging/LoggerStreamAdapter');

describe('Infra :: Logging :: LoggerStreamAdapter', () => {
  describe('.toStream', () => {
    test('wraps the logger into a stream', () => {
      const fakeLogger = {};

      expect(LoggerStreamAdapter.toStream(fakeLogger)).toHaveProperty('write');
    });

    test('removes the \\n character from the message', () => {
      const fakeLogger = {
        info(message) {
          expect(message).toBe('Sliced message');
        }
      };

      LoggerStreamAdapter.toStream(fakeLogger).write('Sliced message\n');
    });
  });
});
