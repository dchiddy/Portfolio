(function($) {
    $.fn.slide = function(options) {
        var defaults = {
            slideWidth: 780,
            autoplay: true,
            duration: 6000,
            showNavigator: true,
            showSlideIndex: true
        };
        var options = $.extend(defaults, options);
        return this.each(function() {
            var slideshow = $(this);
            var o = options;
            var currentPosition = 0;
            var slides = $('.slide');
            var numberOfSlides = slides.length;
            var t;

            // Remove scrollbar in JS
            $('#slidesContainer').css('overflow', 'hidden');

            // Wrap all .slides with #slideInner div
            slides.wrapAll('<div id="slideInner"></div>')

            // Float left to display horizontally, readjust .slides width
			.css({
			    'float': 'left',
			    'width': o.slideWidth
			});

            // Insert a clone of first slide 
            $('.slide:first').clone().appendTo('#slideInner');

            // Set #slideInner width equal to total width of all slides
            $('#slideInner').css('width', o.slideWidth * (numberOfSlides + 1));

            // Insert controls in the DOM
            if (o.showNavigator) {
                slideshow
				    .prepend('<span class="control" id="leftControl">Clicking moves left</span>')
				    .append('<span class="control" id="rightControl">Clicking moves right</span>');

                // Create event listeners for .controls clicks
                $('#leftControl').click(function() { prev(); return false; });
                $('#rightControl').click(function() { next(); return false; });
            }
            // Insert slides index
            if (o.showSlideIndex == true) {
                slideshow.append('<div id="slideIndex"></div>');
                for (var i = 1; i <= numberOfSlides; i++) {
                    $('#slideIndex').append('<span id="slide-' + i + '" class="numbers">' + i + '</span>');
                }
                $('.numbers').click(function() { goto(($(this).attr('id')).replace('slide-', '') - 1, false); return false; });
            }

            // Start
            init();

            //Init function
            function init() {
                manageControls(currentPosition);
                if (o.autoplay == true) setNextTimeOut(o.duration);
            }

            // Next
            function next() {
                currentPosition++;
                if (currentPosition >= numberOfSlides) currentPosition = 0;
                slideTo(currentPosition, true);
            }

            // Previous
            function prev() {
                currentPosition--;
                if (currentPosition < 0) currentPosition = numberOfSlides - 1;
                slideTo(currentPosition, false);
            }

            // Go to a slide 
            function goto(position) {
                currentPosition = position;
                slideTo(currentPosition, false);
            }

            // Set time out for next slide
            function setNextTimeOut() {
                t = setTimeout(function() { next(); }, o.duration);
            }

            function clearNextTimeOut()
            { 
                clearTimeout(t);
            }
            // Slide
            function slideTo(position, continuously) {
                $('#slideInner').stop();
                clearNextTimeOut();
                // usual cases
                if (continuously == false || o.autoplay == false || position != 0) {
                    $('#slideInner').animate({ 'marginLeft': o.slideWidth * (-position) }, '', '',
						function() {
						    manageControls(position);
						    if (o.autoplay == true) setNextTimeOut();
						}
					)
                }
                // autoplay: slide from last to first one continuously
                else {
                    // slide to the 'fake' first slide (actually at the last)
                    $('#slideInner').animate({ 'marginLeft': o.slideWidth * (-numberOfSlides) }, '', '',
						function() {
						    //immediately change to the 'true' first slide
						    $('#slideInner').css('marginLeft', 0);
						    manageControls(position)
						    if (o.autoplay == true) setNextTimeOut();
						}
					)
                }
            }

            // manageControls: Hides and Shows controls depending on currentPosition
            function manageControls(position) {
                if (o.showNavigator) {
                    // Hide left arrow if position is first slide
                    if (position == 0) { $('#leftControl').hide() } else { $('#leftControl').show() };
                    // Hide right arrow if position is last slide
                    if (position == (numberOfSlides - 1)) { $('#rightControl').hide() } else { $('#rightControl').show() };
                }

                // Hilight the current page
                if (o.showSlideIndex == true) {
                    // remove active class from all pages
                    $('.numbers').removeClass("active");
                    // add only to the current page
                    $('#slide-' + (position + 1)).addClass("active");
                }
            }
        });
    };
})(jQuery);