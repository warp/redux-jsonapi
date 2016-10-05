'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _api = require('./api');

var actions = _interopRequireWildcard(_api);

var _serializers = require('../serializers');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('API module', function () {
  describe('Action Creators', function () {
    var resource = { _type: 'widgets' };
    var payload = {
      params: { page: 1 },
      headers: { 'Authorization': 'Token token=123' },
      meta: { auth: true }
    };

    describe('write', function () {
      describe('when the resource does not have an ID', function () {
        it('creates a POST request', function () {
          expect(actions.write(resource, payload)).toEqual({
            type: actions.POST,
            payload: {
              params: payload.params,
              headers: payload.headers,
              resources: [(0, _serializers.serialize)(resource)]
            },
            meta: payload.meta
          });
        });
      });

      describe('when the resource has an ID', function () {
        beforeEach(function () {
          resource = (0, _extends3.default)({}, resource, { id: 1 });
        });

        it('creates a PATCH request', function () {
          expect(actions.write(resource, payload)).toEqual({
            type: actions.PATCH,
            payload: {
              params: payload.params,
              headers: payload.headers,
              resources: [(0, _serializers.serialize)(resource)]
            },
            meta: payload.meta
          });
        });
      });
    });

    describe('read', function () {
      it('creates a GET request', function () {
        expect(actions.read(resource, payload)).toEqual({
          type: actions.GET,
          payload: {
            params: payload.params,
            headers: payload.headers,
            resources: [(0, _serializers.serialize)(resource)]
          },
          meta: payload.meta
        });
      });
    });

    describe('remove', function () {
      it('creates a DELETE request', function () {
        expect(actions.remove(resource, payload)).toEqual({
          type: actions.DELETE,
          payload: {
            params: payload.params,
            headers: payload.headers,
            resources: [(0, _serializers.serialize)(resource)]
          },
          meta: payload.meta
        });
      });
    });

    describe('receive', function () {
      it('creates a RECEIVE action', function () {
        expect(actions.receive([resource])).toEqual({
          type: actions.RECEIVE,
          payload: {
            resources: [resource]
          }
        });
      });
    });
  });

  describe('Reducer', function () {
    it('returns the initial state', function () {
      expect((0, actions.default)(undefined, {})).toEqual({});
    });

    describe('handles RECEIVE', function () {
      it('by adding resources to their buckets', function () {
        var resources = [{
          id: 1,
          type: 'widgets',
          attributes: {
            name: 'Widget #1'
          }
        }, {
          id: 1,
          type: 'gadgets',
          attributes: {
            name: 'Gadget #1'
          }
        }];

        expect((0, actions.default)(undefined, actions.receive(resources))).toEqual({
          widgets: {
            1: resources[0]
          },
          gadgets: {
            1: resources[1]
          }
        });
      });
    });
  });
});