/** Dependencies */
var EventEmitter = require('events').EventEmitter;
var Client       = require('./client.js');


/**
 * Memory PubSub Adapter
 *
 * @constructor
 * @param  {object} config - PubSub config from sails.config.pubsub
 */
var MemoryAdapter = function(config) {
  this.config  = config || {};
  this.emitter = new EventEmitter();
  this.emitter.setMaxListeners(0);
};


/** API */
MemoryAdapter.prototype = {
  
  /**
   * Instantiate Pub client instance
   *
   * @returns {MemoryClient}
   */
  createPub: function() {
    if (!this._client) this._client = new Client(this.emitter);
    return this._client;
  },
  
  
  /**
   * Instantiate Sub client instance
   *
   * @returns {MemoryClient}
   */
  createSub: function() {
    if (!this._client) this._client = new Client(this.emitter);
    return this._client;
  }
  
};



/** Export */
module.exports = MemoryAdapter;