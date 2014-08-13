/** Dependencies */
var EventEmitter = require('events').EventEmitter;


/** @const */
var BROADCAST_ROOM = 'sails_broadcast';


/**
 * Redis PubSub Client
 *
 * @constructor
 * @param  {Redis}        client_adapter - The instantiated node_redis client
 * @param  {EventEmitter} emitter        - Instantiated EventEmitter from RedisAdapter
 * @param  {boolean}      subscriber     - (True) if this is the Sub client
 */
var RedisClient = function(client_adapter, emitter, subscriber) {
  this.adapter  = client_adapter;
  
  this._emitter = emitter || new EventEmitter();
  this._emitter.setMaxListeners(0);
  
  this._subscriber = subscriber || false;
  this._rooms = {};
  
  if (this._subscriber) {
    this._listen();
  }
};


/** API */
RedisClient.prototype = {
  
  /**
   * Subscribe
   *
   * @param {string}   room     - The room to subscribe to
   * @param {function} listener - Function called when event is received
   */
  subscribe: function(room, listener) {
    var room = String(room);
    
    // Sub
    if (!this._rooms[room]) {
      this._rooms[room] = 1;
      this._resubscribe();
    } else {
      this._rooms[room] ++;
    }
    
    // Listen
    this._emitter.on(room, listener);
  },
  
  
  /**
   * Unsubscribe
   * @param {string}   room     - The room to unsubscribe from
   * @param {function} listener - The function that was specified in Client#subscribe()
   */
  unsubscribe: function(room, listener) {
    var room = String(room);
    
    // Unsub
    if (this._rooms[room]) this._rooms[room] --;
    if (this._rooms[room] <= 0) {
      delete this._rooms[room];
      this._resubscribe();
    }
    
    // Listen
    this._emitter.removeListener(room, listener);
  },
  
  
  /**
   * Publish a message to subscribers.
   * If 'message' param left blank it will emit to 'broadcast' room
   *
   * @param {string} room    - Message will be sent to all subscribers of this room
   * @param {?*}     message - The message to be sent.
   */
  publish: function(room, message) {
    if (this._subscriber) return false;
    
    // Emit
    if (!message) {
      // Broadcast
      this.adapter.publish(BROADCAST_ROOM, this._compose(room));
    } else {
      this.adapter.publish(room, this._compose(message));
    }
  },
  
  
  /**
   * Returns list of rooms currently subscribed to
   *
   * @returns {array} - List of room names
   */
  rooms: function() {
    return Object.keys(this._rooms);
  }
  
};


/**
 * Listen to Redis subscriptions
 * Captured messages are emitted to self._emitter
 */
RedisClient.prototype._listen = function() {
  var self = this;
  this.adapter.on('message', function(room, message) {
    self._emitter.emit(room, self._decompose(message));
  });
};


/**
 * Redis SUBSCRIBE
 */
RedisClient.prototype._subscribe = function() {
  var rooms = Object.keys(this._rooms);
  if (rooms.length > 0) {
    this.adapter.send_command('subscribe', rooms);
  }
  // always connect to broadcast
  this.adapter.send_command('subscribe', [BROADCAST_ROOM]);
};


/**
 * Redis UNSUBSCRIBE
 */
RedisClient.prototype._unsubscribe = function() {
  var rooms = Object.keys(this._rooms);
  if (rooms.length === 0) this._emitter.removeAllListeners();
  this.adapter.unsubscribe();
};


/**
 * Safe re-subscription when rooms are added or removed.
 * This ensures low client connection to Redis store.
 */
RedisClient.prototype._resubscribe = function() {
  var self = this;
  this._unsubscribe();
  process.nextTick(function() {
    self._subscribe();
  });
};


/**
 * Safe Message Composition
 *
 * @param   {*}      message - Message to be published
 * @returns {string}
 */
RedisClient.prototype._compose = function(message) {
  if (!message) return '';
  if (typeof message === 'object') return JSON.parse(message);
  return message.toString();
};


/**
 * Safe Message Decomposition
 *
 * @param   {string} message - Message string from Redis to be unserialized
 * @returns {*}
 */
RedisClient.prototype._decompose = function(message) {
  if (!message) return '';
  try {
    return JSON.parse(message);
  } catch (e) {
    return message;
  }
};



/** Export */
module.exports = RedisClient;