/** Dependencies */
var Redis  = require('redis');
var Client = require('./client.js');


/**
 * Redis PubSub Adapter
 *
 * @constructor
 * @param  {object} config - PubSub config from sails.config.pubsub
 */
var RedisAdapter = function(config) {
  this.config  = config || {};
  this.emitter = new EventEmitter();
  this.emitter.setMaxListeners(0);
  
	this.host = this.config.host || '127.0.0.1';
	this.port = this.config.port || 6379;
};


/** API */
RedisAdapter.prototype = {
  
  /**
   * Instantiate Pub client instance
   *
   * @returns {RedisClient}
   */
  createPub: function() {
		if (!this._pub) this._pub = this._createClient();
    return this._pub;
  },
  
  
  /**
   * Instantiate Sub client instance
   *
   * @returns {RedisClient}
   */
  createSub: function() {
		if (!this._sub) this._sub = this._createClient(true);
    return this._sub;
  }
  
};


/**
 * Generate new RedisClient
 *
 * @param   {boolean} subscriber - Indicates the client created is the Sub
 * @returns {RedisClient}
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