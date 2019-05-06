$(document).ready(function(){
	$(window).scroll(function(){
		if($(this).scrollTop() > 30) {
			$(".navbar").addClass("navbar-scrolled");
			$(".navbar a").addClass("navbar-scrolled");
		}
		else {
			$(".navbar").removeClass("navbar-scrolled");
			$(".navbar a").removeClass("navbar-scrolled");
		}
	});
});

