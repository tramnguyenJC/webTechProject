// Might be unused
// document.getElementById('button-signup').addEventListener("click", function() {
// 	console.log("hej");
// 	$('#modalLogin').modal('hide')
// 	$('#modalRegister').modal(show);
// 	// document.querySelector('.bg-modal').style.display = "flex";
// });

document.getElementById('signup').onclick = function() {
	// $('#modalLogin .close').close();
	// jQuery.noConflict(); 
	console.log("sd");
	// $('#modalRegister').show();
	$("#modalLogin").hide;
    $("#modalLogin").on("hidden.bs.modal",function(){
	$("#modalRegister").show();
	});
	
	// $('#modalRegister').appendTo("body").modal('show');
	// $('#modalRegister').appendTo("modal-body").modal();
};

// $("#signup").on("click", function(){
// 	console.log("d");
//     $("#modalLogin").hide;
//     $("#modalLogin").on("hidden.bs.modal",function(){
//     $("#modalRegister").show();
//     });
// });
// $('#modalLogin').on('hidden.bs.modal', function () {
// 	// Load up a new modal...
// 	console.log("s");
// 	$('#modalRegister').show();
//   })

document.querySelector('.close').addEventListener("click", function() {
	console.log("dsd");
	document.querySelector('.bg-modal').style.display = "none";
});

// $(document).ready(function() {
// 	$('.hours li').eq(new Date().getDay()).addClass('highlight-hours');
// });

//
//
//// Get the modal
//var modal = $(document).getElementById('bg-modal');
//
//// Get the button that opens the modal
//var btn = $(document).getElementById("button");
//
//// Get the <span> element that closes the modal
//var span = $(document).getElementsByClassName("close")[0];
//
//// When the user clicks on the button, open the modal 
//btn.onclick = function() {
//  modal.style.display = "block";
//}
//
//// When the user clicks on <span> (x), close the modal
//span.onclick = function() {
//  modal.style.display = "none";
//}
//
//// When the user clicks anywhere outside of the modal, close it
//$(window).onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}