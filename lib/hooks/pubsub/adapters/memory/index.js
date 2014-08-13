/** Dependencies */
var EventEmitter = require('events').EventEmitter;
var Client       = require('./client.js');


/**
 * Memory PubSub Adapter
 */
var MemoryAdapter = function(config) {
  this.config  = config || {};
  this.emitter = new EventEmitter();
  this.emitter.setMaxListeners(0);
};


MemoryAdapter.prototype = {
  
  /**
   * Instantiate Pub
   */
  createPub: function() {
    if (!this._client) this._client = new Client(this.emitter);
    return this._client;
  },
  
  
  /**
   * Instantiate Sub
   */
  createSub: function() {
    if (!this._client) this._client = new Client(this.emitter);
    return this._client;
  }
  
};



/** Export */
module.exports = MemoryAdapter;