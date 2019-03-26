// highlight current day on opeining hours
$(document).ready(function() {
	$('.hours li').eq(new Date().getDay()).addClass('highlight-hours');
});