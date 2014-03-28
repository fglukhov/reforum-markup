$(document).ready(function(){
	if($(".ajaxBox").length){
		$(".ajaxBox").colorbox({
			innerWidth:"843px",
			height:'90%',
			opacity:0.47,
			fixed:true,
			onClosed:function(){
				if($(this).is('[href*=news]')){
					$('body,html').animate({scrollTop:$('#press').offset().top},'slow')	
				}
				if($(this).is('[href*=speakers]')){
					$('body,html').animate({scrollTop:$('#speakers').offset().top},'slow')	
				}
			}
		});
	}
	if($(".ajaxBox2").length){
		$(".ajaxBox2").colorbox({
			innerWidth:"480px",
			height:'300px',
			opacity:0.47,
			fixed:true,
			onClosed:function(){
				if($(this).is('[href*=news]')){
					$('body,html').animate({scrollTop:$('#press').offset().top},'slow')	
				}
				if($(this).is('[href*=speakers]')){
					$('body,html').animate({scrollTop:$('#speakers').offset().top},'slow')	
				}
			}
		});
	}
	if($(".inlineBox").length){
		$(".inlineBox").colorbox({
			inline:true, 
			opacity:0.47,
			fixed:true
		});
	}


	$('.vTitle').add($('.titleBg')).add($('.heartTitle')).each(function(){
		var vTitle = $(this);
		var words = $.trim(vTitle.text()).split(" ");
		var text = words.join("</span> <span class=vTitleWord>");
		$(this).html("<span class=vTitleWord>" + text + "</span>")
	})
	
	if($('#content-slider-1').length){
		$('#content-slider-1').royalSlider({
			autoHeight: true,
			arrowsNav: false,
			fadeinLoadedSlide: false,
			controlNavigationSpacing: 0,
			controlNavigation: 'thumbnails',
			imageScaleMode: 'none',
			imageAlignCenter:false,
			loop: false,
			loopRewind: true,
			numImagesToPreload: 6,
			keyboardNavEnabled: true,
			usePreloader: false,
			transitionType:'fade',
			thumbs: {
				autoCenter: true,
				fitInViewport: true,
				orientation: 'horizontal',
				spacing: 0,
				paddingBottom: 0
			},
			controlsInside:false,
			navigateByClick:false
		});
	}
	if($('#content-slider-2').length){
		$('#content-slider-2').royalSlider({
			autoHeight: true,
			arrowsNav: false,
			fadeinLoadedSlide: false,
			controlNavigationSpacing: 0,
			controlNavigation: 'thumbnails',
			imageScaleMode: 'none',
			imageAlignCenter:false,
			loop: false,
			loopRewind: true,
			numImagesToPreload: 6,
			keyboardNavEnabled: true,
			usePreloader: false,
			transitionType:'fade',
			thumbs: {
				autoCenter: true,
				fitInViewport: true,
				orientation: 'horizontal',
				spacing: 0,
				paddingBottom: 0
			},
			controlsInside:false,
			navigateByClick:false
		});
	}
	if($('#mycarousel').length){
		$('#mycarousel').jcarousel({
			auto: 2,    
			wrap: 'last',
			initCallback: mycarousel_initCallback
		});
	}
});
function mycarousel_initCallback(carousel)
{
    // Disable autoscrolling if the user clicks the prev or next button.
    carousel.buttonNext.bind('click', function() {
        carousel.startAuto(0);
    });

    carousel.buttonPrev.bind('click', function() {
        carousel.startAuto(0);
    });

    // Pause autoscrolling if the user moves with the cursor over the clip.
    carousel.clip.hover(function() {
        carousel.stopAuto();
    }, function() {
        carousel.startAuto();
    });
};