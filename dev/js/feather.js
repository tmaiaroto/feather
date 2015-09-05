(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Cookies.js - 1.2.1
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }

            return Cookies._cache[Cookies._cacheKeyPrefix + key];
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            return {
                key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
                value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };

    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],2:[function(require,module,exports){
/*! minibus - v3.1.0 - 2014-11-22
 * https://github.com/axelpale/minibus
 *
 * Copyright (c) 2014 Akseli Palen <akseli.palen@gmail.com>;
 * Licensed under the MIT license */

(function (root, factory) {
  'use strict';
  // UMD pattern commonjsStrict.js
  // https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS & Node
    factory(exports);
  } else {
    // Browser globals
    factory((root.Minibus = {}));
  }
}(this, function (exports) {
  'use strict';

// Minibus

//**************
// Constructor *
//**************

var Bus = function () {
  // event string -> sub route map
  this.eventMap = {};

  // route string -> route object
  this.routeMap = {};

  // free namespace shared between the event handlers on the bus.
  this.busContext = {};
};

exports.create = function () {
  return new Bus();
};

// For extendability.
// Usage: Minibus.extension.myFunction = function (...) {...};
exports.extension = Bus.prototype;



//*******************
// Helper functions *
//*******************

var isArray = function (v) {
  return Object.prototype.toString.call(v) === '[object Array]';
};

var isEmpty = function (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};



//*************
// Exceptions *
//*************

var InvalidEventStringError = function (eventString) {
  // Usage
  //   throw new InvalidEventStringError(eventString)
  this.name = 'InvalidEventStringError';
  this.message = 'Invalid event string given: ' + eventString;
};

var InvalidRouteStringError = function (routeString) {
  // Usage
  //   throw new InvalidRouteStringError(routeString)
  this.name = 'InvalidRouteStringError';
  this.message = 'Invalid route string given: ' + routeString;
};

var InvalidEventHandlerError = function (eventHandler) {
  // Usage
  //   throw new InvalidEventHandlerError(eventHandler)
  this.name = 'InvalidEventHandlerError';
  this.message = 'Invalid event handler function given: ' + eventHandler;
};



//*******************************************
// Member functions. They all are mutators. *
//*******************************************

var _emit = function (eventString) {
  // Emit an event to execute the bound event handler functions.
  // The event handlers are executed immediately.
  //
  // Parameter
  //   eventString
  //     Event string or array of event strings.
  //   arg1 (optional)
  //     Argument to be passed to the handler functions.
  //   arg2 (optional)
  //   ...
  //
  // Return
  //   nothing
  //
  // Throw
  //   InvalidEventStringError
  //     if given event string is not a string or array of strings.
  //
  var emitArgs, i, subRouteMap, routeString, eventHandlers, busContext;

  // Turn to array for more general code.
  if (!isArray(eventString)) {
    eventString = [eventString];
  }

  // Validate all eventStrings before mutating anything.
  // This makes the on call more atomic.
  for (i = 0; i < eventString.length; i += 1) {
    if (typeof eventString[i] !== 'string') {
      throw new InvalidEventStringError(eventString[i]);
    }
  }

  // Collect passed arguments after the eventString argument.
  emitArgs = [];
  for (i = 1; i < arguments.length; i += 1) {
    emitArgs.push(arguments[i]);
  }

  // Collect all the event handlers bound to the given eventString
  eventHandlers = [];
  for (i = 0; i < eventString.length; i += 1) {
    if (this.eventMap.hasOwnProperty(eventString[i])) {
      subRouteMap = this.eventMap[eventString[i]];
      for (routeString in subRouteMap) {
        if (subRouteMap.hasOwnProperty(routeString)) {
          eventHandlers.push(subRouteMap[routeString].eventHandler);
        }
      }
    }
  }

  // Apply the event handlers.
  // All event handlers on the bus share a same bus context.
  busContext = this.busContext;
  for (i = 0; i < eventHandlers.length; i += 1) {
    eventHandlers[i].apply(busContext, emitArgs);
  }
};

// See Node.js events.EventEmitter.emit
Bus.prototype.emit = _emit;

// See Backbone.js Events.trigger
Bus.prototype.trigger = _emit;

// See Mozilla Web API EventTarget.dispatchEvent
// See http://stackoverflow.com/a/10085161/638546
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.dispatchEvent = _emit;

// See http://stackoverflow.com/a/9672223/638546
// Uncomment to enable. Too rare to be included by default.
//Bus.prototype.fireEvent = _emit;



var _on = function (eventString, eventHandler) {
  // Bind an event string(s) to an event handler function.
  //
  // Parameter
  //   eventString
  //     Event string or array of event strings.
  //     Empty array is ok but does nothing.
  //   eventHandler
  //     Event handler function to be executed when the event is emitted.
  //
  // Throw
  //   InvalidEventStringError
  //   InvalidEventHandlerError
  //
  // Return
  //   a route string or an array of route strings
  //
  var wasArray, i, routeObject, routeString, routeStringArray;

  // Turn to array for more general code.
  // Store whether parameter was array to return right type of value.
  wasArray = isArray(eventString);
  if (!wasArray) {
    eventString = [eventString];
  }

  // Validate all eventStrings before mutating anything.
  // This makes the on call more atomic.
  for (i = 0; i < eventString.length; i += 1) {
    if (typeof eventString[i] !== 'string') {
      throw new InvalidEventStringError(eventString[i]);
    }
  }

  // Validate the eventHandler
  if (typeof eventHandler !== 'function') {
    throw new InvalidEventHandlerError(eventHandler);
  }

  routeStringArray = [];
  for (i = 0; i < eventString.length; i += 1) {
    routeObject = {
      eventString: eventString[i],
      eventHandler: eventHandler
    };

    routeString = Identity.create();
    routeStringArray.push(routeString);

    if (!this.eventMap.hasOwnProperty(eventString[i])) {
      this.eventMap[eventString[i]] = {};
    }
    this.eventMap[eventString[i]][routeString] = routeObject;
    this.routeMap[routeString] = routeObject;
  }

  if (wasArray) {
    return routeStringArray;
  } // else
  return routeStringArray[0];
};

// See Backbone.js Events.on
// See Node.js events.EventEmitter.on
Bus.prototype.on = _on;

// See http://stackoverflow.com/a/9672223/638546
Bus.prototype.listen = _on;

// See Node.js events.EventEmitter.addListener
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.addListener = _on;

// See Mozilla Web API EventTarget.addEventListener
// See http://stackoverflow.com/a/11237657/638546
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.addEventListener = _on;



var _once = function (eventString, eventHandler) {
  // Like _on but reacts to emit only once.
  //
  // Parameter
  //   See _on
  //
  // Return
  //   See _on
  //
  // Throw
  //   InvalidEventStringError
  //   InvalidEventHandlerError
  //
  var that, routeString, called;

  // Validate the eventHandler. On does the validation also.
  // Duplicate validation is required because a wrapper function
  // is feed into on instead the given eventHandler.
  if (typeof eventHandler !== 'function') {
    throw new InvalidEventHandlerError(eventHandler);
  }

  that = this;
  called = false;
  routeString = this.on(eventString, function () {
    if (!called) {
      called = true; // Required to prevent duplicate sync calls
      that.off(routeString);
      // Apply. Use the context given by emit to embrace code dryness.
      eventHandler.apply(this, arguments);
    }
  });
  return routeString;
};

// See Node.js events.EventEmitter.once
// See Backbone.js Events.once
Bus.prototype.once = _once;



var _off = function (routeString) {
  // Unbind one or many event handlers.
  //
  // Parameter
  //   routeString
  //     A route string or an array of route strings or
  //     an array of arrays of route strings.
  //     The route to be shut down.
  //
  // Parameter (Alternative)
  //   eventString
  //     An event string or an array of event strings or
  //     an array of arrays of event strings.
  //     Shut down all the routes with this event string.
  //
  // Parameter (Alternative)
  //   (nothing)
  //     Shut down all the routes i.e. unbind all the event handlers.
  //
  // Throws
  //   InvalidRouteStringError
  //
  // Return
  //   nothing
  //
  var noArgs, i, routeObject, eventString, subRouteMap, rs;

  noArgs = (typeof routeString === 'undefined');
  if (noArgs) {
    this.routeMap = {};
    this.eventMap = {};
    return;
  }

  // Turn to array for more general code.
  if (!isArray(routeString)) {
    routeString = [routeString];
  }

  // Flatten arrays to allow arrays of arrays of route strings.
  // This is needed if user wants to off an array of routes. Some routes
  // might be arrays or route strings because 'on' interface.
  // http://stackoverflow.com/a/10865042/638546
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/
  //   Reference/Global_Objects/Array/concat
  var flat = [];
  flat = flat.concat.apply(flat, routeString);
  routeString = flat;

  // Validate all routeStrings before mutating anything.
  // This makes the off call more atomic.
  for (i = 0; i < routeString.length; i += 1) {
    if (typeof routeString[i] !== 'string') {
      throw new InvalidRouteStringError(routeString[i]);
    }
  }

  for (i = 0; i < routeString.length; i += 1) {
    if (this.routeMap.hasOwnProperty(routeString[i])) {
      routeObject = this.routeMap[routeString[i]];
      delete this.routeMap[routeString[i]];
      delete this.eventMap[routeObject.eventString][routeString[i]];
      // Remove sub route map from the event map if it is empty.
      // This prevents outdated eventStrings piling up on the eventMap.
      if (isEmpty(this.eventMap[routeObject.eventString])) {
        delete this.eventMap[routeObject.eventString];
      }
    } else {
      // As eventString
      eventString = routeString[i];
      if (this.eventMap.hasOwnProperty(eventString)) {
        subRouteMap = this.eventMap[eventString];
        for (rs in subRouteMap) {
          if (subRouteMap.hasOwnProperty(rs)) {
            delete this.routeMap[rs];
          }
        }
        delete this.eventMap[eventString];
      }
    }
  }
  // Assert: event handlers and their routes removed.
};

// Backbone.js Events.off
Bus.prototype.off = _off;

// Node.js events.EventEmitter.removeListener
Bus.prototype.removeListener = _off;

// See Mozilla Web API EventTarget.removeEventListener
// Uncomment to enable. Too lengthy to be included by default.
//Bus.prototype.removeEventListener = _off;


var Identity = (function () {
  // A utility for creating unique strings for identification.
  // Abstracts how uniqueness is archieved.
  //
  // Usages
  //   >>> Identity.create();
  //   '532402059994638'
  //   >>> Identity.create();
  //   '544258285779506'
  //
  var exports = {};
  /////////////////

  exports.create = function () {
    return Math.random().toString().substring(2);
  };

  ///////////////
  return exports;
}());


  // Version
  exports.version = '3.1.0';


// End of intro
}));

},{}],3:[function(require,module,exports){
/**
* Very much taken from:
* Baseline.js 1.0
*
* Copyright 2013, Daniel Eden http://daneden.me
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Sat August 04 23:47:00 2013 GMT
*
* Some adjustments have been made though. In addition to just adding
* a bottom margin, there is the ability to adjust the height of elements
* instead of the margins. This would make the elements flush with the
* baseline instead.
* 
* It shouldn't stretch images too much, but that would depend on the 
* image quality, size, and line height. It's also something that you 
* might not want on every element. A margin is going to work better 
* in most cases, but it depends on design.
*/

module.exports = {
	/**
     * @name     _setBase
     *
     * Set the correct margin-bottom on the given element to get back to the
     * baseline.
     *
     * @param    {Element}  element
     *
     * @private
     */
	_setBase: function(element, setHeight) {
      var self = module.exports,
          height = element.offsetHeight,
          baseLineHeight = (parseInt(getComputedStyle(document.body, null).getPropertyValue('line-height'), 10) / 2);
      setHeight = (setHeight === undefined) ? false:setHeight;
      
      if(height < 1) {
      	return;
      }

      var remSize = Math.round(height) / baseLineHeight;
      if(isNaN(remSize)) {
	    return;
	  }

      /**
       * We set the element's margin-bottom style to a number that pushes the
       * adjacent element down far enough to get back onto the baseline.
       */
      if(setHeight) {
      	// Nearest height, this could be larger or smaller so images may stretch...But only a tiny bit. The next baseline likely isn't far.
      	// For divs, it could throw off the padding if it was intended to be equal. Best to use margin if these cases are undesirable.
      	element.style.height = Math.round(remSize) + "rem";
      } else {
      	// console.log("HEIGHT IN REMS: ", remSize);
      	var marginSize = (Math.round(remSize) - remSize);
      	// console.log("MARGIN NEEDED TO NEXT BASELINE: ", marginSize);

        element.style.marginBottom = marginSize + "rem"; //  baseLineHeight - (height % baseLineHeight) + 'px'; 
  	  }
    },

    /**
     * @name     _init
     *
     * Call `_setBase()` on the given element and add an event listener to the
     * window to reset the baseline on resize.
     *
     * @param    {Element}  element
     *
     * @private
     */
    _init: function(element, setHeight) {
      var self = module.exports;
      self._setBase(element, setHeight);
      setHeight = (setHeight === undefined) ? false:setHeight;

      if('addEventListener' in window) {
        window.addEventListener('resize', function () { self._setBase(element, setHeight); }, false);
      } else if ('attachEvent' in window) {
        window.attachEvent('resize', function () { self._setBase(element, setHeight); });
      }
    },
    /**
     * Adjusts the given elements' bottom margin to ensure they don't push
     * elements below off the baseline grid.
     *
     * Alternatively, if setHeight is not undefined or false, it will adjust
     * the height of the elements instead. This could of course stretch or shrink
     * images, but likely not by a large degree.
     *
     * NOTE: <img> elements should be adjusted BEFORE <div> elements because 
     * if a <div> containing an <img> is adjusted, the <img> within it could then
     * be adjusted which could results in an incorrectly adjusted <div>.
     *
     * One should always start with the inner most children and work their way out
     * for that matter.
     *
     * TODO: Make a function that will take a list of selectors and then order
     * them by heirarchy and then call this function in the proper order.
     *
     * @param    {String/Element/NodeList}  elements
     * @param    {boolean} 					setHeight If true, the height will be set instead of the bottom margin
     */
    baseline: function(elements, setHeight) {
   	  var self = module.exports;
   	  setHeight = (setHeight === undefined) ? false:setHeight;
   	  /**
       * Accept a NodeList or a selector string and set `targets` to the
       * relevant elements.
       */
      var targets = typeof elements === 'string' ? document.querySelectorAll(elements) : elements,
          len = targets.length;

      /**
       * If we have multiple elements, loop through them, otherwise just
       * initialise the functionality on the single element.
       */
      if (len > 1) {
        while (len--) { self._init(targets[len], setHeight); }
      } else {
        self._init(targets[0], setHeight);
      }
    }

    // old
	// the baseline.js has this already in a nicer way. get rid of its support for jquery maybe? maybe not. its nice. and only 3kb.
	// just have to add to it the option to "stretch" and change the height instead of margin.
	// funny, i came up with the same solution. .... also, it more cleverly used modulus % for the remainder...its really a one liner thing.
	// sizeInRem2: function(elem, setMargin) {
	// 		var baseFontSize = Number(getComputedStyle(document.getElementsByTagName('body')[0]).fontSize.match(/(\d*(\.\d*)?)px/)[1]);
	// 		var size = elem.offsetHeight;
	// 		setMargin = (setMargin === undefined) ? false:setMargin;

	// 		// If it fits within the baseline, don't resize it.
	// 		if(size < baseFontSize || isNaN(size)) {
	// 			return;
	// 		}
	// 		console.log("ELEM SIZE: " + size);

	// 		// base font size is 20px
	// 		console.log("BASE: " + baseFontSize);
	// 		// so i made it harder than it had to be
	// 		// see the basefont size? it's the space between the baselines.
	// 		// so divide object height by that and get relative ems
			
	// 		baseFontSize = 17;

	// 		// base line-height is 34px // so half the line-height eh? ^^  NOT font size. which was close, right? 17 vs 20. so it would have rounded fine to the rem. but wasn't correct.
	// 		// using the 17, i got the exact height when using the unrounded rem.
	// 		// maybe we add padding to the bottom ... or margin to the bottom. then we dont need to shrink images... though having them flush is nice.
	// 		// maybe make it optional based on the class.
			
	// 		var remSize = Number(size) / Number(baseFontSize);
	// 		console.log("REM SIZE (unrounded): " + remSize);
	// 		if(isNaN(remSize)) {
	// 			return;
	// 		}
	// 		// get the difference... 
	// 		var difference = Math.round(remSize) - remSize;

	// 		remSize = Math.round(remSize);
	// 		console.log("REM SIZE: " + remSize);

	// 		// Can't make it zero height of course. This shouldn't really be either. It should have returned by now if that were the case.
	// 		if(remSize < 1) {
	// 			remSize = 1;
	// 		}
	// 		// so lets add margin. this way we aren't screwing with the contents of the div and such.
	// 		var currentAttrs = elem.getAttribute("style");
	// 		var missingSemiColon = "";
	// 		if(currentAttrs[currentAttrs.length] != ";" && currentAttrs.length > 0) {
	// 			missingSemiColon = ";";
	// 		}
			
	// 		if(setMargin) {
	// 			console.log('set margin');
	// 			//currentAttrs += missingSemiColon + "margin-bottom:" + remSize + "rem;";
	// 			//elem.setAttribute("style",currentAttrs);
	// 			elem.style.marginBottom=difference+"rem"; // might be all we need. maybe dont need to set style explicitly.
	// 		} else {
	// 			console.log('set height');
	// 			elem.style.height=remSize+"rem";
	// 		}

	// 		// if(size >  2) {
	// 		// 	// return Number((Math.round(1000 / baseFontSize * size) / 1000).toFixed(3)) + "rem"
	// 		// 	// Why + 2, I'm still not sure. Seems to work though.
	// 		// 	// Sassline states: "The height of the baseline grid is then effectively set at 2rem, with increments at each 1rem."
	// 		// 	// So I think it has to do with that, but that doesn't really make sense. Who cares what the height of the grid is.
	// 		// 	// px to em and round to whole number should work. I can make any size so long as its a whole number rem unit and it fits to grid.
	// 		// 	// This can size things up OR down by the way. Slightly stretching images...But not by a terrible amount because a baseline isn't that much.
	// 		// 	// It's not even the closest either though. This isn't the correct math.
	// 		// 	var remSize = Math.round(Number((Math.round(1000 / baseFontSize * size) / 1000).toFixed(3)) + 2);
	// 		// 	if(remSize < 1) {
	// 		// 		// Return back in pixels if less than 1rem. The element can be sized in pixels and not break anything because it fits within the line.
	// 		// 		// Unless there's weird margins and such.
	// 		// 		// TODO: Account for margins. Size margins.
	// 		// 		return;
	// 		// 	}
	// 		// 	//elem.setAttribute("style","height:" + remSize + "rem;");
	// 		// 	var currentAttrs = elem.getAttribute("style");
	// 		// 	currentAttrs += ";" + remSize + "rem;";
	// 		// 	elem.setAttribute("style",currentAttrs);
	// 		// 	elem.style.height=remSize+"rem";
	// 		// }
	// 	}

};
},{}],4:[function(require,module,exports){
/*!
 * ki.js - jQuery-like API super-tiny JavaScript library
 * Copyright (c) 2014 Denis Ciccale (@tdecs)
 * Released under MIT license
 * Original source: https://github.com/dciccale/ki.js
 *
 * This was modified (not forked, though maybe it will be) to avoid conflicts with jQuery.
 * $ was changed to $ki
 * JSLint ignore comments were also added as well as a module.exports.
 * 
 */
/* jshint ignore:start */
!function (b, c, d, e, f) {

  // addEventListener support?
  f = b['add' + e];

  /*
   * init function (internal use)
   * a = selector, dom element or function
   * d = placeholder for matched elements
   * i = placeholder for length of matched elements
   */
  function i(a, d, i) {
    for(d = (a && a.nodeType ? [a] : '' + a === a ? b.querySelectorAll(a) : c), i = d.length; i--; c.unshift.call(this, d[i]));
  }

  /*
   * $ki main function
   * a = css selector, dom object, or function
   * http://www.dustindiaz.com/smallest-domready-ever
   * returns instance or executes function on ready
   */
  $ki = function (a) {
    return /^f/.test(typeof a) ? /in/.test(b.readyState) ? setTimeout('$ki('+a+')', 9) : a() : new i(a);
  };

  // set ki prototype
  $ki[d] = i[d] = {

    // default length
    length: 0,

    /*
     * on method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    on: function (a, b) {
      return this.each(function (c) {
        return f ? c['add' + e](a, b, false) : c.attachEvent('on' + a, b);
      });
    },

    /*
     * off method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    off: function (a, b) {
      return this.each(function (c) {
        return f ? c['remove' + e](a, b) : c.detachEvent('on' + a, b);
      });
    },

    /*
     * each method
     * a = the function to call on each iteration
     * b = the this value for that function (the current iterated native dom element by default)
     * return this
     */
    each: function (a, b) {
      for (var c = this, d = 0, e = c.length; d < e; ++d) {
        a.call(b || c[d], c[d], d, c);
      }
      return c;
    },

    // for some reason is needed to get an array-like
    // representation instead of an object
    splice: c.splice
  };
}(document, [], 'prototype', 'EventListener');
/* jshint ignore:end */

module.exports = $ki;
},{}],5:[function(require,module,exports){
module.exports = {
	first: function() {
		return $ki(this[0]);
	},
	last: function() {
		return $ki(this[this.length - 1]);
	},
	outerHeight: function() {
		this.each(function(b) {
			b.outerHeight = b.offsetHeight;
			var style = getComputedStyle(b);
			b.outerHeight += parseInt(style.marginTop) + parseInt(style.marginBottom);
		});
		return this.length > 1 ? this : this[0].outerHeight;
	},
	outerWidth: function() {
		this.each(function(b) {
			b.outerWidth = b.offsetWidth;
			var style = getComputedStyle(b);
			b.outerWidth += parseInt(style.marginLeft) + parseInt(style.marginRight);
		});
		return this.length > 1 ? this : this[0].outerWidth;
	},
	html: function(a) {
		return a === []._ ? this[0].innerHTML : this.each(function(b) {
			b.innerHTML = a;
		});
	},
	offset: function() {
		this.each(function(b) {
			var rect = b.getBoundingClientRect();
			b.offset = {
			  top: rect.top + document.body.scrollTop,
			  left: rect.left + document.body.scrollLeft
			};
		});
		return this.length > 1 ? this : this[0].offset;
	},
	hasClass: function(a) {
		return this[0].classList.contains(a);
	},
	/**
	 * Determines if an element falls within the browser's viewport.
	 * 
	 * @param  {number}  x How much of the element must be visible along the x axis as a percentage (0, 0.5, 1, etc.)
	 * @param  {number}  y How much of the element must be visible along the y axis as a percentage (0, 0.5, 1, etc.)
	 * @return {boolean}   Whether or not enough of the element is visible on the screen to count
	*/
	isOnScreen: function(x, y) {
		if(x === null || typeof x === 'undefined') { x = 1; }
	    if(y === null || typeof y === 'undefined') { y = 1; }
	    
	    var viewport = {};
	    viewport.left = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
		viewport.top = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

	    viewport.right = viewport.left + window.innerWidth;
	    viewport.bottom = viewport.top + window.innerHeight;
	    
	    var height = this.outerHeight();
	    var width = this.outerWidth();
	 
	    if(!width || !height){
	        return false;
	    }
	    
	    var bounds = this.offset();
	    bounds.right = bounds.left + width;
	    bounds.bottom = bounds.top + height;
	    
	    var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
	    
	    if(!visible){
	        return false;   
	    }
	    
	    var deltas = {
	        top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
	        bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),
	        left : Math.min(1, ( bounds.right - viewport.left ) / width),
	        right : Math.min(1, ( viewport.right - bounds.left ) / width)
	    };
	    
	    return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;
	}
};
},{}],6:[function(require,module,exports){
(function() {
	// Make this available on the window for convenience and as $ki so it doesn't conflict with $
	window.$ki = require('./ki.ie8.js');

	Feather = (function() {
		var defaults = {
			autoBaseline: false,
			autoBaselineResizeImages: true
		};

		/**
		 * Telepathic Black Panther
		 * 
		 * @param {object} config Some configuration options used by Feather
		*/
		function Feather(config) {
			// Feather() or new Feather() will work this way.
			if (!(this instanceof Feather)) return new Feather(config);

			// Extend default config with passed config options.
			this.config = this.extend(defaults, config);

			// Core modules
			var baseline = require('./baseline');
			this.baseline = baseline.baseline;
			/**
			 * Export baseline as a jQuery or Zepto plugin if any of them are loaded,
			 * otherwise export as a browser global (of course also available as `Feather.baseline()`).
			*/
			if(typeof $ !== "undefined") {
				$.extend($.fn, {
					baseline: function (options) {
						return this.baseline(this, options);
					}
				});
			} else {
				window.baseline = this.baseline;
			}
			// Set it automatically
			if(this.config.autoBaseline) {
				// NOTE: Images MUST be resized or have margin added BEFORE divs. Because they will change the height of the div they are in!
				// So if the div was sized first, then the image was sized - it could push the div down below the baseline.
				
				// If set to slightly resize the images (true by default).
				if(this.config.autoBaselineResizeImages) {
					this.baseline('img', true);
				} else {
					// Else, just adjust their margin.
					this.baseline('img');
				}
				this.baseline('div.units-row');
				
			}

			// Load some 3rd party modules.
			this.bus = require('../../node_modules/minibus/minibus.js').create();
			this.cookies = require('../../node_modules/cookies-js/src/cookies.js');

			// Shortcut $ki.
			this.extend(window.$ki.prototype, require('./ki.plugins.js'));
			this.$ = window.$ki;

			// Cookie the user. Set the first time Telepathic Black Panther spotted them (trying to keep cookie names short, fv = first visit).
			if(!this.cookies.get("_feather_fv")) {
				this.cookies.set("_feather_fv", (new Date().getTime()), {expires: Infinity});
			}
		}

		Feather.prototype = {
			/**
			 * Simple extend to mimic jQuery's because we don't want a dep on jQuery for just this.
			 * That'd be sillyness.
			 * 
			 * @return {Object} Returns an extended object
			*/
			extend: function() {
				for(var i=1; i<arguments.length; i++) {
					for(var key in arguments[i]) {
						if(arguments[i].hasOwnProperty(key)) {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
				return arguments[0];
			}
		};
		
		return Feather;
	})();
	module.exports = Feather;
})();
},{"../../node_modules/cookies-js/src/cookies.js":1,"../../node_modules/minibus/minibus.js":2,"./baseline":3,"./ki.ie8.js":4,"./ki.plugins.js":5}]},{},[3,4,5,6]);
