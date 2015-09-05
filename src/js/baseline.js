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