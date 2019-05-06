// highlight current day on opening hours
$(document).ready(function() {
	$('.hours li').eq(new Date().getDay()).addClass('highlight-hours');
	// Get the popup coupon
	var popup = document.getElementById('coupon-popup');
	if (!sessionStorage.alreadyClicked) {
	    popup.style.display = "block";
	    sessionStorage.alreadyClicked = 1;
	}
	// popup.style.display = "block";

	// Get the <span> element that closes the popup
	var closeButton = document.getElementsByClassName("coupon-close")[0];

	// When the user clicks on <span> (x), close the popup
	closeButton.onclick = function() {
	  popup.style.display = "none";
	}
	// When the user clicks anywhere outside of the popup, close it
	window.onclick = function(event) {
	  if (event.target == popup) {
	    popup.style.display = "none";
	  }
	}
});