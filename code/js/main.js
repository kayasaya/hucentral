jQuery(document).ready(function($){
	var slidesWrapper = $('.cd-hero-slider');

	//check if a .cd-hero-slider exists in the DOM 
	if ( slidesWrapper.length > 0 ) {
		var primaryNav = $('.cd-primary-nav'),
			sliderNav = $('.cd-slider-nav'),
			navigationMarker = $('.cd-marker'),
			slidesNumber = slidesWrapper.children('li').length,
			visibleSlidePosition = 0,
			autoPlayId,
			autoPlayDelay = 5000;

		//upload videos (if not on mobile devices)
		uploadVideo(slidesWrapper);

		//autoplay slider
		setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);

		//on mobile - open/close primary navigation clicking/tapping the menu icon
		primaryNav.on('click', function(event){
			if($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
		});
		
		//change visible slide
		sliderNav.on('click', 'li', function(event){
			event.preventDefault();
			var selectedItem = $(this);
			if(!selectedItem.hasClass('selected')) {
				// if it's not already selected
				var selectedPosition = selectedItem.index(),
					activePosition = slidesWrapper.find('li.selected').index();
				
				if( activePosition < selectedPosition) {
					nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
				} else {
					prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
				}

				//this is used for the autoplay
				visibleSlidePosition = selectedPosition;

				updateSliderNavigation(sliderNav, selectedPosition);
				updateNavigationMarker(navigationMarker, selectedPosition+1);
				//reset autoplay
				setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
			}
		});
	}

	function nextSlide(visibleSlide, container, pagination, n){
		visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			visibleSlide.removeClass('is-moving');
		});

		container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
		checkVideo(visibleSlide, container, n);
	}

	function prevSlide(visibleSlide, container, pagination, n){
		visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			visibleSlide.removeClass('is-moving');
		});

		container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
		checkVideo(visibleSlide, container, n);
	}

	function updateSliderNavigation(pagination, n) {
		var navigationDot = pagination.find('.selected');
		navigationDot.removeClass('selected');
		pagination.find('li').eq(n).addClass('selected');
	}

	function setAutoplay(wrapper, length, delay) {
		if(wrapper.hasClass('autoplay')) {
			clearInterval(autoPlayId);
			autoPlayId = window.setInterval(function(){autoplaySlider(length)}, delay);
		}
	}

	function autoplaySlider(length) {
		if( visibleSlidePosition < length - 1) {
			nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, visibleSlidePosition + 1);
			visibleSlidePosition +=1;
		} else {
			prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, 0);
			visibleSlidePosition = 0;
		}
		updateNavigationMarker(navigationMarker, visibleSlidePosition+1);
		updateSliderNavigation(sliderNav, visibleSlidePosition);
	}

	function uploadVideo(container) {
		container.find('.cd-bg-video-wrapper').each(function(){
			var videoWrapper = $(this);
			if( videoWrapper.is(':visible') ) {
				// if visible - we are not on a mobile device 
				var	videoUrl = videoWrapper.data('video'),
					video = $('<video loop><source src="'+videoUrl+'.mp4" type="video/mp4" /><source src="'+videoUrl+'.webm" type="video/webm" /></video>');
				video.appendTo(videoWrapper);
				// play video if first slide
				if(videoWrapper.parent('.cd-bg-video.selected').length > 0) video.get(0).play();
			}
		});
	}

	function checkVideo(hiddenSlide, container, n) {
		//check if a video outside the viewport is playing - if yes, pause it
		var hiddenVideo = hiddenSlide.find('video');
		if( hiddenVideo.length > 0 ) hiddenVideo.get(0).pause();

		//check if the select slide contains a video element - if yes, play the video
		var visibleVideo = container.children('li').eq(n).find('video');
		if( visibleVideo.length > 0 ) visibleVideo.get(0).play();
	}

	function updateNavigationMarker(marker, n) {
		marker.removeClassPrefix('item').addClass('item-'+n);
	}

	$.fn.removeClassPrefix = function(prefix) {
		//remove all classes starting with 'prefix'
	    this.each(function(i, el) {
	        var classes = el.className.split(" ").filter(function(c) {
	            return c.lastIndexOf(prefix, 0) !== 0;
	        });
	        el.className = $.trim(classes.join(" "));
	    });
	    return this;
	};
    
        ///////////////
        //BOUNCY MENU//
        ///////////////
    
    var is_onphone_nav_animating = false;
	//open onphone navigation
	$('.cd-onphone-nav-trigger').on('click', function(){
		triggeronphoneNav(true);
	});
	//close onphone navigation
	$('.cd-onphone-nav-modal .cd-close').on('click', function(){
		triggeronphoneNav(false);
	});
	$('.cd-onphone-nav-modal').on('click', function(event){
		if($(event.target).is('.cd-onphone-nav-modal')) {
			triggeronphoneNav(false);
		}
	});

	function triggeronphoneNav($bool) {
		//check if no nav animation is ongoing
		if( !is_onphone_nav_animating) {
			is_onphone_nav_animating = true;
			
			//toggle list items animation
			$('.cd-onphone-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$('.cd-onphone-nav-modal').toggleClass('is-visible', $bool);
				if(!$bool) $('.cd-onphone-nav-modal').removeClass('fade-out');
				is_onphone_nav_animating = false;
			});
			
			//check if CSS animations are supported... 
			if($('.cd-onphone-nav-trigger').parents('.no-csstransitions').length > 0 ) {
				$('.cd-onphone-nav-modal').toggleClass('is-visible', $bool);
				is_onphone_nav_animating = false;
			}
		}
	}
    
    var is_yourself_nav_animating = false;
	//open yourself navigation
	$('.cd-yourself-nav-trigger').on('click', function(){
		triggeryourselfNav(true);
	});
	//close yourself navigation
	$('.cd-yourself-nav-modal .cd-close').on('click', function(){
		triggeryourselfNav(false);
	});
	$('.cd-yourself-nav-modal').on('click', function(event){
		if($(event.target).is('.cd-yourself-nav-modal')) {
			triggeryourselfNav(false);
		}
	});

	function triggeryourselfNav($bool) {
		//check if no nav animation is ongoing
		if( !is_yourself_nav_animating) {
			is_yourself_nav_animating = true;
			
			//toggle list items animation
			$('.cd-yourself-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$('.cd-yourself-nav-modal').toggleClass('is-visible', $bool);
				if(!$bool) $('.cd-yourself-nav-modal').removeClass('fade-out');
				is_yourself_nav_animating = false;
			});
			
			//check if CSS animations are supported... 
			if($('.cd-yourself-nav-trigger').parents('.no-csstransitions').length > 0 ) {
				$('.cd-yourself-nav-modal').toggleClass('is-visible', $bool);
				is_yourself_nav_animating = false;
			}
		}
	}
    
        var is_amex_nav_animating = false;
	//open amex navigation
	$('.cd-amex-nav-trigger').on('click', function(){
		triggeramexNav(true);
	});
	//close amex navigation
	$('.cd-amex-nav-modal .cd-close').on('click', function(){
		triggeramexNav(false);
	});
	$('.cd-amex-nav-modal').on('click', function(event){
		if($(event.target).is('.cd-amex-nav-modal')) {
			triggeramexNav(false);
		}
	});

	function triggeramexNav($bool) {
		//check if no nav animation is ongoing
		if( !is_amex_nav_animating) {
			is_amex_nav_animating = true;
			
			//toggle list items animation
			$('.cd-amex-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$('.cd-amex-nav-modal').toggleClass('is-visible', $bool);
				if(!$bool) $('.cd-amex-nav-modal').removeClass('fade-out');
				is_amex_nav_animating = false;
			});
			
			//check if CSS animations are supported... 
			if($('.cd-amex-nav-trigger').parents('.no-csstransitions').length > 0 ) {
				$('.cd-amex-nav-modal').toggleClass('is-visible', $bool);
				is_amex_nav_animating = false;
			}
		}
	}
});