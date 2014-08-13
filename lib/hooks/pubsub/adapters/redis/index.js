/** Dependencies */
var Redis  = require('redis');
var Client = require('./client.js');


/**
 * Redis PubSub Adapter
 */
var RedisAdapter = function(config) {
  this.config = config;
	this.host   = config.host || '127.0.0.1';
	this.port   = config.port || 6379;
};


RedisAdapter.prototype = {
  
  /**
   * Instantiate new client
   */
  createClient: function() {
		// Create a new client using the port, host and other options
		var client = Redis.createClient(this.port, this.host, this.config);

		// If a password is needed use client.auth to set it
		if(config.pass) {
			client.auth(config.pass, function(err) {
		        if (err) throw err;
		    });
		}

		// If a db is set select it on the client
		if (config.db) {
			client.select(config.db);
		}

		return new Client(client);
  }
  
};



/** Export */
module.export = RedisAdapter;