const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiChange = require('chai-change');
const cleanDatabase = require('test/support/cleanDatabase');

chai.use(sinonChai);
chai.use(chaiChange);

beforeEach(cleanDatabase);
