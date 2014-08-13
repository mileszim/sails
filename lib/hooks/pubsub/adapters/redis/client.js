/**
 * Redis PubSub Client
 *
 * @constructor
 */
var RedisClient = function(client_adapter) {
  this.adapter = client_adapter;
};


RedisClient.prototype = {
  
  /**
   * Subscribe
   */
  subscribe: function() {
    
  }
  
};


/** Export */
module.exports = RedisClient;