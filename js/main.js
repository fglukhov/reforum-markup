$(document).ready(function(){

	validateForms()
	
	$(".video-tabs .tab").click(function() {
		$(".video-tabs .tab").removeClass("tab-act");
		$(this).addClass("tab-act");
		
		$(".video-player").hide();
		$(".video-player").eq($(this).prevAll(".tab").length).fadeIn(250);
		
	});

/* 	var anc = window.location.hash.replace("#","");
	if (anc == "regiContent") {
		setTimeout( function() {
			$('#regiContent_id').click().attr('id','regiContent_id_del');
		}, 1000);
	} else {
		if($('#regEnd_id').length){
			setTimeout( function() {
				$('#regEnd_id').click().attr('id','regEnd_id_del');
			}, 1500);
		}
	} */
	// if($('#regiContent_id').length){
		// setTimeout( function() {
			// $('#regiContent_id').click().attr('id','regiContent_id_del');
		// }, 1500);
	// }
	
	$("select").change(function () { 
	   var str = ""; 
	   str = $(this).find(":selected").text(); 
	   $(".out").text(str); 
	}).trigger('change'); 	
	
	$('a[href^=#]').not('.inlineBox').not('.ajaxBox').on('click',function(){
		var anhor = $(this).attr('href');
		$('body,html').animate({scrollTop:$(anhor).offset().top},'slow')	
		return false
	});
	
	$('.triggerLink').on('click',function(){
		if($('.when_1').is('.whenShow')){
			$('.when_1').css({zIndex:'5'}).removeClass('whenShow');
			$('.triggerLink').html('<span class="icMap"></span>Переключиться обратно');
		}else{
			$('.when_1').css({zIndex:'20'}).addClass('whenShow');
			$('.triggerLink').html('<span class="icMap"></span>Переключиться на карту')	
		}
	})
	
	function initialize() {    
		var myLatlng = new google.maps.LatLng(55.739963,37.262000);
		var myOptions = {
			zoom: 15,
			scrollwheel: false,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
		var contentString = '<div id="mapContent">'+$('.mapAdress').html()+'</div>';
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(55.739602,37.267807),
			map: map,
			title: 'Uluru (Ayers Rock)',
			icon: 'pic/map_marker.png'
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});
	}
	if($('#map_canvas').length){
		initialize();
	}
	
	$('.tItem').on('mouseenter',function(){
		var heartPice = $(this).attr('data-heart');
		$('.'+heartPice).show().siblings('.heart').hide();
	}).on('mouseleave',function(){
		$('.heart').hide();
	})
	
	//start vertical middle
	$('.middle_inner').each(function(){
		$('<span>').addClass('helper').appendTo($(this).parent());	
	})
	//end vertical middle
});

function validateForms() {
  
  $("form").each(function() {
    $(this).validate({
      focusInvalid: false,
      sendForm : false,
      errorPlacement: function(error, element) {
        // element.parents(".input-wrapper").addClass("input-wrapper-error");
        if (element.attr("errortext")) {
          error.html(element.attr("errortext"))
        }
        error.insertAfter(element).wrap("<div class='error-wrapper' />");
        element.prev(".placeholder").addClass("placeholder-error")
        if (element[0].tagName == "SELECT") {
          element.parents(".form-item").find(".param-selector").addClass("param-sel-error")
        }
        
        if (element.parents().hasClass("errors-bottom") || element.parents().hasClass("errors-top")) {
          element.parents(".form-item").find(".error-wrapper").css({
            left: - element.parents(".form-item").find(".error-wrapper").width()/2 + element.outerWidth()/2
          });
        }
      },
      unhighlight: function(element, errorClass, validClass) {
        // $(element).parents(".input-wrapper").removeClass("input-wrapper-error");
        $(element).removeClass(errorClass);
        $(element).next(".error-wrapper").remove();
        $(element).prev(".placeholder").removeClass("placeholder-error");
        if ($(element)[0].tagName == "SELECT") {
          $(element).parents(".form-item").find(".param-selector").removeClass("selector-error")
        }
      },
      invalidHandler: function(form, validatorcalc) {
          var errors = validatorcalc.numberOfInvalids();
          if (errors && validatorcalc.errorList[0].element.tagName == "INPUT") {                    
              validatorcalc.errorList[0].element.focus();
          }
      }
    });
    
    if ($(this).find(".form-email").length) {
      $(this).find(".form-email").rules('add', {
        email: true,
        messages: {
          required:  "Введите правильный адрес!"
        }
      });
    }
    
    if ($(this).find(".form-date").length) {
      $(this).find(".form-date").rules('add', {
        messages: {
          required:  "Выберите дату!"
        }
      });
    }
    
    if ($(this).find(".form-email").length && $(this).find(".form-phone").length) {
      var thisField = $(this).find(".form-phone");
      var relatedField = $(this).find(".form-email");
      thisField.rules('add', {
        required: function(element) {
          if (relatedField.val() == "") {
            return true;
          } else {
            return false;
          }
        }
      });
      var thisField2 = $(this).find(".form-email");
      var relatedField2 = $(this).find(".form-phone");
      thisField2.rules('add', {
        required: function(element) {
          if (relatedField2.val() == "") {
            return true;
          } else {
            return false;
          }
        }
      });
    }
    
    $(document).mouseup(function (e) {
      var container = $("form");

      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
          $(".error-wrapper").remove();
      }
    });
		
		$(document).mouseup(function (e) {
      var container = $(".tooltip");

      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
          $(".tooltip").fadeOut(150);
      }
    });
    
  });  
    
}

jQuery.extend(jQuery.validator.messages, {
	required: "Заполните поле!",
	remote: "Please fix this field.",
	email: "Введите правильный e-mail",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	number: "Please enter a valid number.",
	digits: "Please enter only digits.",
	creditcard: "Please enter a valid credit card number.",
	equalTo: "Please enter the same value again.",
	accept: "Please enter a value with a valid extension.",
	maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
	minlength: jQuery.validator.format("Please enter at least {0} characters."),
	rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
	range: jQuery.validator.format("Please enter a value between {0} and {1}."),
	max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
	min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});