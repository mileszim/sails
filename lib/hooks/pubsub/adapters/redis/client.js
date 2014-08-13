/** Dependencies */
var EventEmitter = require('events').EventEmitter;


/** @const */
var BROADCAST_ROOM = 'sails_broadcast';


/**
 * Redis PubSub Client
 *
 * @constructor
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
   * Publish
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
   * Rooms
   */
  rooms: function() {
    return Object.keys(this._rooms);
  }
  
};


/**
 * Listen to Redis
 */
RedisClient.prototype._listen = function() {
  var self = this;
  this.adapter.on('message', function(room, message) {
    self._emitter.emit(room, self._decompose(message));
  });
};


/**
 * Subscribe to Redis
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
 * Unsubscribe from Redis
 */
RedisClient.prototype._unsubscribe = function() {
  var rooms = Object.keys(this._rooms);
  if (rooms.length === 0) this._emitter.removeAllListeners();
  this.adapter.unsubscribe();
};


/**
 * Re Subscribe to Redis
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
 */
RedisClient.prototype._compose = function(message) {
  if (!message) return '';
  if (typeof message === 'object') return JSON.parse(message);
  return message.toString();
};


/**
 * Safe Message Decomposition
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