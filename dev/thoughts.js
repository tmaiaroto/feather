
		// px2rem
		//function px2rem(baseFontSize, src) {
		function px2rem(src) {
			var baseFontSize = Number(getComputedStyle(document.getElementsByTagName('body')[0]).fontSize.match(/(\d*(\.\d*)?)px/)[1]);

			var result = src.replace(/(\d+)px/ig, function(match, size)
			{
				if (size == 1)
					return '1px';
				else if (size == 2)
					return '2px';
				else
					// return Number((Math.round(1000 / baseFontSize * size) / 1000).toFixed(3)) + "rem"
					// Why + 2, I'm still not sure. Seems to work though.
					// Sassline states: "The height of the baseline grid is then effectively set at 2rem, with increments at each 1rem."
					// So I think it has to do with that, but that doesn't really make sense. Who cares what the height of the grid is.
					// px to em and round to whole number should work. I can make any size so long as its a whole number rem unit and it fits to grid.
					// This can size things up OR down by the way. Slightly stretching images...But not by a terrible amount because a baseline isn't that much.
					// It's not even the closest either though. This isn't the correct math.
					var remSize = Math.round(Number((Math.round(1000 / baseFontSize * size) / 1000).toFixed(3)) + 2);
					if(remSize < 1) {
						// Return back in pixels if less than 1rem. The element can be sized in pixels and not break anything because it fits within the line.
						// Unless there's weird margins and such.
						// TODO: Account for margins. Size margins.
						return src + 'px';
					}
					return remSize + "rem"
			});
			return result;
		}

		// gets root size
		// var parentElement = $('p')[0];
		// var rootSize = Number(getComputedStyle(parentElement, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
		// console.log(rootSize);

		// of body, which is nice because who knows maybe there isn't a <p> on page.
		var rootSize = Number(getComputedStyle(document.getElementsByTagName('body')[0]).fontSize.match(/(\d*(\.\d*)?)px/)[1]);
		console.log(rootSize);



		// overkill.		
		// Number(getComputedStyle(document.body,null).fontSize.replace(/[^\d]/g, ''))
		// var rS = Number(  // Casts numeric strings to number
		// 	getComputedStyle(  // takes element and returns CSSStyleDeclaration object
		// 		document.body,null) // use document.body to get first "styled" element
		// 	.fontSize  // get fontSize property
		// 	.replace(/[^\d\.]/g, '')  // simple regex that will strip out non-numbers
		// ) // returns number
		// console.log(parseFloat(rS))

		$( document ).ready(function() {
			// $('img').each(function() {
				
			// 	var roundedRem = px2rem(rootSize, $(this).height() + 'px');
			// 	console.dir(roundedRem);
			// 	$(this).css('height', roundedRem);
			// });

		});