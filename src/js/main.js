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