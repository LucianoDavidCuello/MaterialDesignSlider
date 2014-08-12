/*
 * slideControl - jQuery Plugin
 * version: 1.2 October 2012
 * @requires jQuery v1.6 or later
 *
 * Examples at http://nikorablin.com/slideControl
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
 
 /*Modificado por
  *David Cuello
  *14/08/11
  *
  */
(function($){
	 $.fn.slideControl = function(options) {
		
		// defaults
		var defaults = {
			speed: 400,
			lowerBound: 1,
			upperBound: 10
		};

		var options = $.extend(defaults, options);
		
		return this.each(function() {
			
			// set vars
			var o = options;
			var controller = false;
			var position = 0;
			var obj = this;
			$(this).addClass('slideControlInput');
			var parent = $(this).parent();
			
			parent.html("<span class=\"slideControlContainer\"><div class=\"pin\"></div><span class=\"pin_dato\"></span><span class=\"slideControlFill\" style=\"width:" + $(obj).val()*10 + "%\"><span class=\"slideControlHandle\"></span></span></span>" + $(obj).wrap("<span></span>").parent().html());
			var container = parent.find('.slideControlContainer');
			var dato= parent.find(".pin_dato");
			var fill = container.find('.slideControlFill');
			var handle = fill.find('.slideControlHandle');
			var pin= parent.find('.pin');
			var input = parent.find('input');
			var containerWidth = container.outerWidth() ;
			var handleWidth = $(handle).outerWidth();
			var offset = $(container).offset();
			var animate = function(value){
				$(fill).animate({ width: value + "%"}, o.speed);
				$(pin).animate({ left: ((position*2)-($(pin).width()-5)) + "px"}, o.speed, function(){ $(pin).hide();});
				$(dato).animate({ left: ((position*2)-($(dato).width()-5)) + "px"}, o.speed, function(){ $(dato).hide();});
			}
			animate(position);
			$(window).resize(function() {
				offset = $(container).offset();
			})
			
			//adds shadow class to handle for IE <9
			if (getInternetExplorerVersion() < 9 && getInternetExplorerVersion() > -1) {
				handle.addClass('ieShadow');
			}
			
			// when user clicks anywhere on the slider
			$(container).click(function(e) {		
				e.preventDefault();
				position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
				$(pin).show();
				$(dato).show();
				animate(position);
				$(input).val(position/10);
				$(dato).text(Math.round(position/10));
			});
			
			// when user clicks handle
			$(handle).mousedown(function(e) {
				e.preventDefault();
				$(pin).show();
				$(dato).show();
				controller = true;
				$(document).mousemove(function(e) {
					e.preventDefault();
					position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
					if (controller) {	
						$(fill).width(position + "%");
						$(pin).css( "left", ((position*2)-($(pin).width()-5)) + "px");
						$(dato).css( "left", ((position*2)-($(pin).width()-5)) + "px");
						$(input).val(position/10);
						$(dato).text(Math.round(position/10));
					}
				});
				$(document).mouseup(function() {
					e.preventDefault();
					$(pin).hide();
					$(dato).hide();
					controller = false;
				});
			});
			
			// when user changes value in input
			$(input).change(function() {
				var value = checkBoundaries($(this).val()*10);
				if ($(this).val() > o.upperBound)
					$(input).val(o.upperBound);
				else if ($(this).val() < o.lowerBound)
					$(input).val(o.lowerBound);
				animate(value);
			});
			
		});
		
		// checks if value is within boundaries
		function checkBoundaries(value) {
			if (value < options.lowerBound*10)
				return options.lowerBound*10;
			else if (value > options.upperBound*10)
				return options.upperBound*10;
			else
				return value;
		}
		
		// checks ie version
		function getInternetExplorerVersion(){
		   var rv = -1;
		   if (navigator.appName == 'Microsoft Internet Explorer') {
			  var ua = navigator.userAgent;
			  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			  if (re.exec(ua) != null)
				 rv = parseFloat( RegExp.$1 );
		   }
		   return rv;
		}
		return this;
	 }
})(jQuery);
