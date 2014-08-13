/** Dependencies */
var EventEmitter = require('events').EventEmitter;


/**
 * Memory PubSub Client
 *
 * @constructor
 */
var MemoryClient = function(client_adapter) {
  this.adapter  = client_adapter;
  this._emitter = this.adapter;
};


/** API */
MemoryClient.prototype = {
  
  /**
   * Subscribe
   */
  subscribe: function(room, listener) {
    var room = String(room);
    
    // Listen
    this._emitter.on(room, listener);
  },
  
  
  /**
   * Unsubscribe
   */
  unsubscribe: function(room, listener) {
    var room = String(room);
    
    // Listen
    this._emitter.on(room, listener);
  }
  
};


/** Export */
module.exports = MemoryClient;