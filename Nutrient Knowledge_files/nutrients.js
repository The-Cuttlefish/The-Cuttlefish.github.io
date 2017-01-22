$(function()
{
	var main = $('#nutrients-main'),
		elements = $('#nutrients-nav .elements li'),
		nutrients = main.find('.nutrient');
	
	$('#nutrients-nav .elements ')
	
		.delegate('li', 'mouseover', function(event) 
		{
			$(this).addClass('hover')
		})
		.delegate('li', 'mouseout', function(event)
		{
			$(this).removeClass('hover')
		})
		.delegate('li', 'click', function(event)
		{
			var id = $(this).find('.element-symbol').text(),
				target = main.find('#element-'+id);
			
			if($(this).hasClass('selected'))
			{
				elements.removeClass('selected');
				main.addClass('intro');
				nutrients.fadeOut(200);
			}
			else
			{
				elements.removeClass('selected');
				main.removeClass('intro');
				$(this).addClass('selected');
				
				nutrients
					.stop()
					.not(target)
					.animate({opacity: 0, 'margin-left': '-40px'}, 300, function() 
					{ 
						$(this).hide(); 
					});
				
				target
					.stop()
					.show()					
					.css({opacity: 0, 'margin-left': '15px'})					
					.animate({opacity: 1, 'margin-left': 0}, 500);
				
				// nutrients.not(target).fadeOut(200, function() { target.fadeIn(200); });
			}
			
			event.preventDefault();
			return false;
		});
	
	$('#nutrients-main .tabs')
		.each(function()
		{
			var links = $(this).find('a'),
				active = $(links[0]).addClass('selected'),
				content = $( active.attr('href').replace('#', '.') );
			
			links.not(active).each(function() 
			{
				$( $(this).attr('href').replace('#', '.') ).hide();
			});
		})
		.delegate('a', 'click', function(event)
		{
			var parent = $(this).closest('li.nutrient'),
				target = parent.find( $(this).attr('href').replace('#', '.') );
			
			parent
				.find('.tabs a').removeClass('selected')
				.end()
				.find('.tab-content').not(target).hide();
			
			target.show();
			
			if(target.hasClass('slideshow') && !target.hasClass('inited')) 
			{
				initSlideshow(target);
			}
			
			$(this).addClass('selected');
			
			event.preventDefault();
			return false;
		});
	
	function initSlideshow(target)
	{
		var slides = target.find('.slides');
			symbol = target.closest('li.nutrient').attr('id').split('-')[1],
			prefix = slides.data('prefix').toLowerCase(),
			count = slides.data('count');
		
		for(var i = 1; i <= count; i++) 
		{
			var src = 'images/photos/' + symbol + '/' + prefix + '_' + i + '.jpg';
			$('<img src="'+src+'" />').appendTo(slides);	
		}
		
		slides.cycle(
		{ 
			prev	: target.find('.prev'), 
			next	: target.find('.next'), 
			speed	: 400,
			timeout	: 0,
			fx		: 'fade'
		});
		
		target.addClass('inited');
	}

});

/*!
 * jQuery Cycle Lite Plugin
 * http://malsup.com/jquery/cycle/lite/
 * Copyright (c) 2008-2012 M. Alsup
 * Version: 1.7 (20-FEB-2013)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3.2 or later
 */
(function(e){var a="Lite-1.7";var b=/MSIE/.test(navigator.userAgent);e.fn.cycle=function(f){return this.each(function(){f=f||{};if(this.cycleTimeout){clearTimeout(this.cycleTimeout);}this.cycleTimeout=0;this.cyclePause=0;var m=e(this);var j=f.slideExpr?e(f.slideExpr,this):m.children();var h=j.get();if(h.length<2){if(window.console){console.log("terminating; too few slides: "+h.length);}return;}var g=e.extend({},e.fn.cycle.defaults,f||{},e.metadata?m.metadata():e.meta?m.data():{});var n=e.isFunction(m.data)?m.data(g.metaAttr):null;if(n){g=e.extend(g,n);}g.before=g.before?[g.before]:[];g.after=g.after?[g.after]:[];g.after.unshift(function(){g.busy=0;});var o=this.className;g.width=parseInt((o.match(/w:(\d+)/)||[])[1],10)||g.width;g.height=parseInt((o.match(/h:(\d+)/)||[])[1],10)||g.height;g.timeout=parseInt((o.match(/t:(\d+)/)||[])[1],10)||g.timeout;if(m.css("position")=="static"){m.css("position","relative");}if(g.width){m.width(g.width);}if(g.height&&g.height!="auto"){m.height(g.height);}var i=0;j.css({position:"absolute",top:0}).each(function(p){e(this).css("z-index",h.length-p);});e(h[i]).css("opacity",1).show();if(b){h[i].style.removeAttribute("filter");}if(g.fit&&g.width){j.width(g.width);}if(g.fit&&g.height&&g.height!="auto"){j.height(g.height);}if(g.pause){m.hover(function(){this.cyclePause=1;},function(){this.cyclePause=0;});}var k=e.fn.cycle.transitions[g.fx];if(k){k(m,j,g);}j.each(function(){var p=e(this);this.cycleH=(g.fit&&g.height)?g.height:p.height();this.cycleW=(g.fit&&g.width)?g.width:p.width();});if(g.cssFirst){e(j[i]).css(g.cssFirst);}if(g.timeout){if(g.speed.constructor==String){g.speed={slow:600,fast:200}[g.speed]||400;}if(!g.sync){g.speed=g.speed/2;}while((g.timeout-g.speed)<250){g.timeout+=g.speed;}}g.speedIn=g.speed;g.speedOut=g.speed;g.slideCount=h.length;g.currSlide=i;g.nextSlide=1;var l=j[i];if(g.before.length){g.before[0].apply(l,[l,l,g,true]);}if(g.after.length>1){g.after[1].apply(l,[l,l,g,true]);}if(g.click&&!g.next){g.next=g.click;}if(g.next){e(g.next).unbind("click.cycle").bind("click.cycle",function(){return d(h,g,g.rev?-1:1);});}if(g.prev){e(g.prev).unbind("click.cycle").bind("click.cycle",function(){return d(h,g,g.rev?1:-1);});}if(g.timeout){this.cycleTimeout=setTimeout(function(){c(h,g,0,!g.rev);},g.timeout+(g.delay||0));}});};function c(k,f,j,l){if(f.busy){return;}var i=k[0].parentNode,o=k[f.currSlide],m=k[f.nextSlide];if(i.cycleTimeout===0&&!j){return;}if(j||!i.cyclePause){if(f.before.length){e.each(f.before,function(p,q){q.apply(m,[o,m,f,l]);});}var g=function(){if(b){this.style.removeAttribute("filter");}e.each(f.after,function(p,q){q.apply(m,[o,m,f,l]);});n(f);};if(f.nextSlide!=f.currSlide){f.busy=1;e.fn.cycle.custom(o,m,f,g);}var h=(f.nextSlide+1)==k.length;f.nextSlide=h?0:f.nextSlide+1;f.currSlide=h?k.length-1:f.nextSlide-1;}else{n(f);}function n(p){if(p.timeout){i.cycleTimeout=setTimeout(function(){c(k,p,0,!p.rev);},p.timeout);}}}function d(f,g,j){var i=f[0].parentNode,h=i.cycleTimeout;if(h){clearTimeout(h);i.cycleTimeout=0;}g.nextSlide=g.currSlide+j;if(g.nextSlide<0){g.nextSlide=f.length-1;}else{if(g.nextSlide>=f.length){g.nextSlide=0;}}c(f,g,1,j>=0);return false;}e.fn.cycle.custom=function(l,i,j,f){var k=e(l),h=e(i);h.css(j.cssBefore);var g=function(){h.animate(j.animIn,j.speedIn,j.easeIn,f);};k.animate(j.animOut,j.speedOut,j.easeOut,function(){k.css(j.cssAfter);if(!j.sync){g();}});if(j.sync){g();}};e.fn.cycle.transitions={fade:function(g,h,f){h.not(":eq(0)").hide();f.cssBefore={opacity:0,display:"block"};f.cssAfter={display:"none"};f.animOut={opacity:0};f.animIn={opacity:1};},fadeout:function(g,h,f){f.before.push(function(l,j,k,i){e(l).css("zIndex",k.slideCount+(i===true?1:0));e(j).css("zIndex",k.slideCount+(i===true?0:1));});h.not(":eq(0)").hide();f.cssBefore={opacity:1,display:"block",zIndex:1};f.cssAfter={display:"none",zIndex:0};f.animOut={opacity:0};f.animIn={opacity:1};}};e.fn.cycle.ver=function(){return a;};e.fn.cycle.defaults={animIn:{},animOut:{},fx:"fade",after:null,before:null,cssBefore:{},cssAfter:{},delay:0,fit:0,height:"auto",metaAttr:"cycle",next:null,pause:false,prev:null,speed:1000,slideExpr:null,sync:true,timeout:4000};})(jQuery);
