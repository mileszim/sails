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
};


/** Export */
module.exports = PubSub;