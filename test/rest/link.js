const { assert }       = require('chai');
const mockery          = require('mockery');
const sinon            = require('sinon');
const HTTPCodes        = require('../../app/rest/http-codes');
const Errors           = require('../../app/rest/errors');
const makeMockObj      = require('./make-mock-obj');
const makeMockResponse = require('./make-mock-response');

describe('rest/link', function() {
  describe('rest/link basics', function() {
    it('sendError', function() {
      const sendError = require('../../app/rest/link/send-error');
      const res0 = makeMockResponse();
      const error0 = new Error('SAMPLE -314');
      error0.statusCode = -314;
      const res1 = makeMockResponse();
      const error1 = new Error('SAMPLE 500');
  
      sendError(res0, error0);
      sendError(res1, error1);
  
      assert.equal(res0.status.callCount, 1, 'response.status() should be called once');
      assert.equal(res0.status.args[0][0], error0.statusCode, 'Should send error.statusCode.');
      assert.equal(res1.status.args[0][0], HTTPCodes.internalServerError, 'Should send 500 when no code specified.');
      assert.equal(res0.send.callCount,  1, 'response.send() should be called once');
      assert.equal(res0.status.args[0][0],  error0.statusCode, 'Should have set error.statusCode as status');
      assert.deepEqual(
        res0.send.args[0][0],
        {
          success: false,
          error: error0
        },
        'Incorrect response'
      );
    });
  
    it('sendData', function() {
      const sendData = require('../../app/rest/link/send-data');
      const res = makeMockResponse();
      const data = { foo: 'bar' };
      sendData(res, data);
      assert.equal(res.status.args[0][0], HTTPCodes.ok);
      assert.deepEqual(
        res.json.args[0][0],
        {
          success: true,
          data
        },
        'Incorrect response json'
      );
    });
  });

  describe('rest/link ops', function() {
    let mockSendError;
    let mockSendData;
  
    before(function() {
      mockery.enable();
      mockery.warnOnUnregistered(false);
    });

    beforeEach(function() {
      /* mockSendError = sinon.spy(function(a, b) { // eslint-disable-line
        console.trace('>>>', a, b, '<<<');
      }); 
      */
      mockSendError = sinon.stub();
      mockSendData  = sinon.stub();
      mockery.registerMock('./send-data', mockSendData);
      mockery.registerMock('./send-error', mockSendError);
    });
  
    after(function() {
      mockery.disable();
    });
  
    afterEach(function() {
      mockery.deregisterAll();
    });
  
    it('createOne', function() {
      const createOne = require('../../app/rest/link/create-one');
      const model = makeMockObj({ create: 'foo' });
      const createArgs = { foo: 'bar' };
      const returnValue = createOne(model, createArgs);
      assert.equal(model.create.args[0][0], createArgs);
      assert.equal(returnValue, 'foo');
      assert.equal(model.create.callCount, 1);
    });
  
    it('retrieveOne', async function() {
      const retrieveOne = require('../../app/rest/link/retrieve-one');
      const testError = new Error('bar');
      const modelSuccessful = makeMockObj({ findById: () => Promise.resolve(['foo']) });
      const modelUnsuccessful = makeMockObj({ findById: () => Promise.reject(testError) });
      const req = {
        params: {
          id: -314
        }
      };
      const res = { baz: 'qux' };

      await retrieveOne(modelSuccessful, req, res);
      assert.equal(mockSendData.callCount, 1);
      assert.deepEqual(mockSendData.args[0], [res, ['foo']]);
      assert.equal(modelSuccessful.findById.args[0][0], -314);

      try {
        await retrieveOne(modelUnsuccessful, req, res);
      } catch (err) {
        assert.equal(modelUnsuccessful.findById.args[0][0], -314);
        assert.deepEqual(mockSendError.args[0], [res, testError]);
      }
    });

    it('retrieveAll', async function() {
      const retrieveAll = require('../../app/rest/link/retrieve-all');
      const req = {
        params: {
          limit: 1,
          offset: 2,
          order: 3,
          query: 4
        }
      };
      const res = { foo: 'bar' };
      const testData = ['foo'];
      const testError = new Error('bar');
      const modelSuccessful = makeMockObj({ findAll: Promise.resolve(testData) });
      const modelUnsuccessful = makeMockObj({ findAll: () => Promise.reject(testError) });
      await retrieveAll(modelSuccessful, req, res);
      assert.deepEqual(mockSendData.args, [[
        res,
        {
          count: testData.length,
          items: testData,
          offset: 2,
          order: 3
        }
      ]]);

      try{
        await retrieveAll(modelUnsuccessful, req, res);
      } catch (err) {
        assert.deepEqual(mockSendError.args, [[res, testError]]);
      }
    });

    it('updateOne', async function() {
      const updateOne = require('../../app/rest/link/update-one');
      const mockItem = makeMockObj({
        set: null,
        save: Promise.resolve('foo')
      });
      const modelSuccessful = makeMockObj({
        findById: Promise.resolve(mockItem)
      });
      const modelUnsuccessful = makeMockObj({
        findById: Promise.resolve()
      });
      const newItemData = {
        id: 0,
        key: 'newValue'
      };
      
      await updateOne(modelSuccessful, newItemData);
      assert.deepEqual(mockItem.set.args, [[newItemData]]);
      assert.equal(mockItem.save.callCount, 1);

      try {
        await updateOne(modelUnsuccessful, newItemData);
      } catch(err) {
        assert.instanceOf(err, Errors.NotFound);
      }
    });

    it('createUpdateAll', async function() {
      const mockUpdateOne = sinon.stub();
      const mockCreateOne = sinon.stub();
      mockery.registerMock('./update-one', mockUpdateOne);
      mockery.registerMock('./create-one', mockCreateOne);
      const createUpdateAll = require('../../app/rest/link/create-update-all');
      createUpdateAll({}, { body: {} }, {});
      assert.equal(mockSendError.callCount, 1);
      assert.instanceOf(mockSendError.args[0][1], Errors.MissingArgs)
      
      const items = [{
        id: 0,
        a: 'b'
      }, {
        id: 1,
        c: 'd'
      }, {
        e: 'f'
      }, {
        id: 2,
        g: 'h'
      }];
      const req = {
        body: { items }
      }
      const res = {};
      await createUpdateAll({}, req, res);
      assert.equal(mockUpdateOne.callCount, 3);
      assert.equal(mockCreateOne.callCount, 1);
    });

    it('delOne', async function() {
      const delOne = require('../../app/rest/link/del-one');
      const modelSuccessful   = makeMockObj({ destroy: Promise.resolve(314) });
      const modelUnsuccessful = makeMockObj({ destroy: () => Promise.reject(42) });
      const req = {
        params: {
          id: 76
        }
      };
      const res = {};
      await delOne(modelSuccessful, req, res);
      // in normal practice, deleted should always be 0 or 1; because we search by id
      assert.deepEqual(mockSendData.args, [[res, { deleted: 314 }]]);
      try {
        await delOne(modelUnsuccessful, req, res);
        assert.deepEqual(mockSendError.args, [[res, 42]]);
      } catch(err) {
        // eat the error; we expected it.
      }
    });

    it('delAll', async function() {
      const limit = 42;
      const query = { foo: 'bar' };
      const req = {
        body: {
          limit,
          query
        }
      };
      const res = {};
      const model = makeMockObj({ destroy: Promise.resolve(42) });
      const delAll = require('../../app/rest/link/del-all');
      await delAll(model, req, res);
      assert.deepEqual(mockSendData.args, [[res, { deleted: 42}]]);
    });

    it('link');
  });
});