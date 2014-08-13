/** Dependencies */
var EventEmitter   = require('events').EventEmitter;
var memory_adapter = require('./adapters/memory');
var redis_adapter  = require('./adapters/redis');



/**
 * PubSub Class
 *
 * @constructor
 */
var PubSub = function(config) {
  // load adapter
  var Adapter = (config.adapter && config.adapter === 'redis') ? redis_adapter : memory_adapter;
  
  // initialize
  this._adapter = new Adapter(config);
  this._pub = this._adapter.createClient();
  this._sub = this._adapter.createClient();
  
  // Emitter
  this.emitter = new EventEmitter();
};


/** API */
PubSub.prototype = {
  
  subscribe: function(room, listener) {},
  
  unsubscribe: function(room, listener) {},
  
  publish: function(room, message) {},
  
  broadcast: function(message) {},
  
  subscribers: function(room) {},
  
  rooms: function() {}
  
};


/**
 * Listen to Adapter Events
 */
PubSub.prototype._listen = function() {
  var events = this._adapter.emitter;
  events.
  
};


/** Export */
module.exports = PubSub;