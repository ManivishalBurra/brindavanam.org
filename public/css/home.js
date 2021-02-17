

/* Please ❤ this if you like it! */

window.addEventListener("scroll",function(){

		var intViewportWidth = window.innerWidth;
   if(intViewportWidth>500){
	  var offset=window.pageYOffset;
		starting.style.backgroundPositionY="-"+offset*0.4+"px";
		// starting.style.opacity=1- offset/700;

	}},{passive:true});
	window.addEventListener("scroll",function(){
			var intViewportWidth = window.innerWidth;
			if(intViewportWidth>500){
		  var offset=window.pageYOffset;
			// home_parallalax.style.opacity=1- offset/700;
			home_parallalax.style.backgroundPositionY="-"+offset*0.4+"px";
		}},{passive:true});

(function($) { "use strict";

	$(function() {
		var header = $(".start-style");
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();

			if (scroll >= 10) {
				header.removeClass('start-style').addClass("scroll-on");
			} else {
				header.removeClass("scroll-on").addClass('start-style');
			}
		});
	});

	//Animation

	$(document).ready(function() {
		$('body.hero-anime').removeClass('hero-anime');
	});

	//Menu On Hover

	$('body').on('mouseenter mouseleave','.nav-item',function(e){
			if ($(window).width() > 750) {
				var _d=$(e.target).closest('.nav-item');_d.addClass('show');
				setTimeout(function(){
				_d[_d.is(':hover')?'addClass':'removeClass']('show');
				},1);
			}
	});

	//Switch light/dark

	$("#switch").on('click', function () {
		if ($("body").hasClass("dark")) {
			$("body").removeClass("dark");
			$("#switch").removeClass("switched");
		}
		else {
			$("body").addClass("dark");
			$("#switch").addClass("switched");
		}
	});

  })(jQuery);
	/*
	Get the width of a single item, multiply by total # of items (10 in this case), then divide by 2 as well.
	*/

	const item = document.querySelector(".item");
	const items = document.querySelectorAll(".item");
	const marquee = document.querySelector(".marquee");

	const total = Array.from(items).length;

	marquee.style.width = `${(item.clientWidth * total) / 2}px`;
	// function myFunction(came) {
	//   came.value="liked";
	// 	console.log(came.value);
	// 	return came.value;
	// }
