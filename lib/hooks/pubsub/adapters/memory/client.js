/** Dependencies */
var EventEmitter = require('events').EventEmitter;


/** @const */
var BROADCAST_ROOM = 'sails_broadcast';


/**
 * Memory PubSub Client
 *
 * @constructor
 */
var MemoryClient = function(client_adapter, emitter) {
  this.adapter  = client_adapter;
  this._emitter = client_adapter;
  this._rooms   = {};
};


/** API */
MemoryClient.prototype = {
  
  /**
   * Subscribe
   */
  subscribe: function(room, listener) {
    var room = String(room);
    
    // Sub
    if (!this._rooms[room]) {
      this._rooms[room] = 1;
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
    }
    
    // Listen
    this._emitter.removeListener(room, listener);
  },
  
  
  /**
   * Publish
   */
  publish: function(room, message) {
    // Emit
    if (!message) {
      // Broadcast
      this._emitter.emit(BROADCAST_ROOM, room);
    } else {
      this._emitter.emit(room, message);
    }
  },
  
  
  /**
   * Rooms
   */
  rooms: function() {
    return Object.keys(this._rooms);
  }
  
};


/** Export */
module.exports = MemoryClient;