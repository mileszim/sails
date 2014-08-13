/** Dependencies */
var EventEmitter = require('events').EventEmitter;
var Client       = require('./client.js');


/**
 * Memory PubSub Adapter
 */
var MemoryAdapter = function(config) {
  this.config  = config;
  this.emitter = new EventEmitter();
  this.emitter.setMaxListeners(0);
};


MemoryAdapter.prototype = {
  
  /**
   * Instantiate new client
   */
  createClient: function() {
    return new Client(this.emitter);
  }
  
};



/** Export */
module.export = MemoryAdapter;