const { expect } = require('chai');
const LoggerStreamAdapter = require('src/infra/logging/LoggerStreamAdapter');

describe('Infra :: Logging :: LoggerStreamAdapter', () => {
  describe('.toStream', () => {
    it('wraps the logger into a stream', () => {
      const fakeLogger = {};

      expect(LoggerStreamAdapter.toStream(fakeLogger)).to.have.all.keys('write');
    });

    it('removes the \\n character from the message', () => {
      const fakeLogger = {
        info(message) {
          expect(message).to.equal('Sliced message');
        }
      };

      LoggerStreamAdapter.toStream(fakeLogger).write('Sliced message\n');
    });
  });
});
