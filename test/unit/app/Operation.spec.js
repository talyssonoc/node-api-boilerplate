const Operation = require('src/app/Operation');

describe('App :: Operation', () => {
  var CustomOperation;

  beforeEach(() => {
    CustomOperation = class CustomOperation extends Operation {

    };

    CustomOperation.setOutputs(['SUCCESS']);
  });

  describe('#on', () => {
    describe('when added handler for a valid output', () => {
      test('does not throw', () => {
        const operation = new CustomOperation();

        expect(() => {
          operation.on(operation.outputs.SUCCESS, () => {});
        }).toNotThrow;
      });
    });

    describe('when added handler for a invalid output', () => {
      test('does not throw', () => {
        const operation = new CustomOperation();

        expect(() => {
          operation.on('INVALID', () => {});
        }).toThrowError(Error);
      });
    });
  });
});
