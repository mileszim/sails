/** Dependencies */
var EventEmitter  = require('events').EventEmitter;
var MemoryAdapter = require('./adapters/memory');
var RedisAdapter  = require('./adapters/redis');


/** @const */
var BROADCAST_ROOM = 'sails_broadcast';
var DEFAULT_EVENT  = 'message';



/**
 * PubSub Class
 *
 * @constructor
 * @param  {object} config - PubSub config from sails.config.pubsub
 */
var PubSub = function(config) {
  // load adapter
  var Adapter = (config.adapter && config.adapter === 'redis') ? RedisAdapter : MemoryAdapter;
  
  // initialize
  this._adapter = new Adapter(config);
  this._pub = this._adapter.createClient();
  this._sub = this._adapter.createClient();
  
  // Emitter
  this.emitter = this._adapter.emitter;
};


/** API */
PubSub.prototype = {
  
  /**
   * Subscribe
   *
   * @param {string}   room     - The room to subscribe to
   * @param {string}   event    - Event to subscribe to
   * @param {function} listener - Function called when event is received
   */
  subscribe: function(room, event, listener) {
    room  = room  || BROADCAST_ROOM;
    event = event || DEFAULT_EVENT;
    this._sub.subscribe(this._eventspace(room, event), listener);
    return true;
  },
  
  
  /**
   * Unsubscribe
   *
   * @param {string}   room     - The room to unsubscribe from
   * @param {string}   event    - Event that was subscribed to
   * @param {function} listener - The function that was specified in Client#subscribe()
   */
  unsubscribe: function(room, event, listener) {
    room  = room  || BROADCAST_ROOM;
    event = event || DEFAULT_EVENT;
    this._sub.unsubscribe(this._eventspace(room, event), listener);
    return true;
  },
  
  
  /**
   * Publish a message to subscribers of a room.
   *
   * @param {string} room    - Message will be sent to all subscribers of this room
   * @param {string} event   - Message event
   * @param {?*}     message - The message to be sent.
   */
  publish: function(room, event, message) {
    room  = room  || BROADCAST_ROOM;
    event = event || DEFAULT_EVENT;
    this._pub.publish(this._eventspace(room, event), message);
    return true;
  },
  
  
  /**
   * Broadcast a message to all subscribers.
   *
   * @param {string} event   - Message event
   * @param {?*}     message - The message to be sent.
   */
  broadcast: function(event, message) {
    event = event || DEFAULT_EVENT;
    this._pub.publish(this._eventspace(BROADCAST_ROOM, event), message);
    return true;
  },
  
  
  /**
   * Get a list of subscribers for a room & event.
   *
   * @param   {string} room
   * @param   {string} event
   * @returns {array} - The list of subscribers
   */
  subscribers: function(room, event) {
    return this.emitter.listeners(this._eventspace(room, event));
  },
  
  
  /**
   * Returns list of all rooms with listeners
   *
   * @returns {array} - List of room names
   */
  rooms: function() {
    return this._adapter.rooms();
  }
  
};


/**
 * Generate namespaced event identifier
 *
 * @param {string} room
 * @param {string} event
 */
PubSub.prototype._eventspace = function(room, event) {
  return room + '~' + event;
};



/** Export */
module.exports = PubSub;