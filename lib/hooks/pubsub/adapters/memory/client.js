/**
 * Memory PubSub Client
 *
 * @constructor
 */
var MemoryClient = function(client_adapter) {
  this.adapter = client_adapter;
};


MemoryClient.prototype = {
  
  /**
   * Subscribe
   */
  subscribe: function() {
    
  }
  
};


/** Export */
module.exports = MemoryClient;