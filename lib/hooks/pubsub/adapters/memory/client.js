/** Dependencies */
var EventEmitter = require('events').EventEmitter;


/** @const */
var BROADCAST_ROOM = 'sails_broadcast';


/**
 * Memory PubSub Client
 *
 * @constructor
 * @param  {EventEmitter} client_adapter - In this instance, just the EventEmitter
 * @param  {EventEmitter} emitter        - EventEmitter from the MemoryAdapter
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
   *
   * @param {string}   room     - The room to subscribe to
   * @param {function} listener - Function called when event is received
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
   *
   * @param {string}   room     - The room to unsubscribe from
   * @param {function} listener - The function that was specified in Client#subscribe()
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
   * Publish a message to subscribers.
   * If 'message' param left blank it will emit to 'broadcast' room
   *
   * @param {string} room    - Message will be sent to all subscribers of this room
   * @param {?*}     message - The message to be sent. Can be any type accepted by EventEmitter#emit()
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
   * Returns list of rooms currently subscribed to
   *
   * @returns {array} - List of room names
   */
  rooms: function() {
    return Object.keys(this._rooms);
  }
  
};


/** Export */
module.exports = MemoryClient;