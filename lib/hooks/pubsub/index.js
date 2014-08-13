/** Dependencies */
var util       = require('sails-util');
var _          = require('lodash')
var STRINGFILE = require('sails-stringfile');
var PubSub     = require('./pubsub.js');


/** Module Errors */
var Err = {
  dependency: function (dependent, dependency) {
    return new Error( '\n' +
      'Cannot use `' + dependent + '` hook ' +
      'without the `' + dependency + '` hook enabled!'
    );
  }
};




/**
 * Sails PubSub Module
 */
module.exports = function(sails) {

  /**
   * Expose Hook definition
   */
  return {
    
    
    /**
     * Defaults
     */
    defaults: {
      pubsub: {
        adapter: undefined
      }
    },
    
    
    
    /**
     * Initialize
     */
    initialize: function(cb) {
      var self = this;
    
      // Complain if no ORM
      if (!sails.hooks.orm) {
        return cb( Err.dependency('pubsub', 'orm') );
      }
    
      // Wait for `hook:orm:loaded`
      sails.on('hook:orm:loaded', function() {

        // Do the heavy lifting
        //self.augmentModels();

        // Indicate that the hook is fully loaded
        cb();

      });

      // When the orm is reloaded, re-apply all of the pubsub methods to the
      // models
      sails.on('hook:orm:reloaded', function() {
        //self.augmentModels();

        // Trigger an event in case something needs to respond to the pubsub reload
        sails.emit('hook:pubsub:reloaded');
      });
    
    }
    
  };
  
  
  
};