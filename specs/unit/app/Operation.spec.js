const Operation = require('src/app/Operation');

describe('App :: Operation', () => {
  let CustomOp;

  beforeEach(() => {
    CustomOp = class CustomOperation extends Operation {

    };

    CustomOp.setOutputs(['SUCCESS']);
  });

  describe('#on', () => {
    describe('when added handler for a valid output', () => {
      test('does not throw', () => {
        const operation = new CustomOp();

        expect(() => {
          operation.on(operation.outputs.SUCCESS, () => { });
        }).not.toThrow();
      });
    });

    describe('when added handler for a invalid output', () => {
      test('throw', () => {
        const operation = new CustomOp();

        expect(() => {
          operation.on('INVALID', () => { });
        }).toThrow(Error, /Invalid output "INVALID" to operation CustomOperation/);
      });
    });
  });
});
