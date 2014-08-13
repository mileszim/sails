/** Dependencies */
var Redis  = require('redis');
var Client = require('./client.js');


/**
 * Redis PubSub Adapter
 */
var RedisAdapter = function(config) {
  this.config  = config || {};
  this.emitter = new EventEmitter();
  this.emitter.setMaxListeners(0);
  
	this.host = this.config.host || '127.0.0.1';
	this.port = this.config.port || 6379;
};


RedisAdapter.prototype = {
  
  /**
   * Instantiate Pub
   */
  createPub: function() {
		if (!this._pub) this._pub = this._createClient();
    return this._pub;
  },
  
  
  /**
   * Instantiate Sub
   */
  createSub: function() {
		if (!this._sub) this._sub = this._createClient(true);
    return this._sub;
  }
  
};


/**
 * Instantiate new client
 */
RedisAdapter.prototype._createClient = function(subscriber) {
  var self = this;
  
  var sub = subscriber || false;
  
	// Create a new client using the port, host and other options
	var client = Redis.createClient(this.port, this.host, this.config);

	// If a password is needed use client.auth to set it
	if (this.config.pass) {
		client.auth(this.config.pass, function(err) {
	        if (err) throw err;
	    });
	}

	// If a db is set select it on the client
	if (this.config.db) {
		client.select(config.db);
	}

	return new Client(client, self.emitter, sub);
};



/** Export */
module.exports = RedisAdapter;