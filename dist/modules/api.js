'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receive = exports.remove = exports.write = exports.read = exports.DELETE = exports.PATCH = exports.POST = exports.GET = exports.RECEIVE = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _humps = require('humps');

var _serializers = require('../serializers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RECEIVE = exports.RECEIVE = '@@redux-jsonapi/RECEIVE';
var GET = exports.GET = '@@redux-jsonapi/GET';
var POST = exports.POST = '@@redux-jsonapi/POST';
var PATCH = exports.PATCH = '@@redux-jsonapi/PATCH';
var DELETE = exports.DELETE = '@@redux-jsonapi/DELETE';

var request = function request(method, resources, _ref) {
  var _ref$meta = _ref.meta;
  var meta = _ref$meta === undefined ? {} : _ref$meta;
  var payload = (0, _objectWithoutProperties3.default)(_ref, ['meta']);

  return {
    type: method,
    payload: (0, _extends5.default)({}, payload, {
      resources: resources
    }),
    meta: meta
  };
};

var prepareResources = function prepareResources(resources) {
  if (Array.isArray(resources)) return resources.map(function (resource) {
    return (0, _serializers.serialize)(resource);
  });
  return [(0, _serializers.serialize)(resources)];
};

var dataResource = function dataResource(resources) {
  resources = prepareResources(resources);
  return resources[resources.length - 1];
};

var read = exports.read = function read(resources) {
  var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return request(GET, prepareResources(resources), payload);
};

var write = exports.write = function write(resources) {
  var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return request(dataResource(resources).hasOwnProperty('id') ? PATCH : POST, prepareResources(resources), payload);
};

var remove = exports.remove = function remove(resources) {
  var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return request(DELETE, prepareResources(resources), payload);
};

var receive = exports.receive = function receive(resources, method) {
  return {
    type: RECEIVE,
    payload: {
      method: method,
      resources: resources
    }
  };
};

function getInitialState() {
  return {};
}

function receiveReducer(state, _ref2) {
  var method = _ref2.method;
  var resources = _ref2.resources;

  return resources.reduce(function (nextState, resource) {
    return (0, _extends5.default)({}, nextState, (0, _defineProperty3.default)({}, (0, _humps.camelize)(resource.type), (0, _extends5.default)({}, nextState[(0, _humps.camelize)(resource.type)], (0, _defineProperty3.default)({}, resource.id, method === DELETE ? undefined : resource))));
  }, state);
}

function reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? getInitialState() : arguments[0];
  var _ref3 = arguments[1];
  var type = _ref3.type;
  var payload = _ref3.payload;

  switch (type) {
    case RECEIVE:
      return receiveReducer(state, payload);
    default:
      return state;
  }
}

exports.default = reducer;