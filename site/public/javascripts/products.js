$(document).ready(function () {
  $(".sub > a").click(function() {
    var ul = $(this).next(),
    clone = ul.clone().css({"height":"auto"}).appendTo(".mini-menu"),
    height = ul.css("height") === "0px" ? ul[0].scrollHeight + "px" : "0px";
    clone.remove();
    ul.animate({"height":height});
    return false;
  });
  $('.mini-menu > ul > li > a').click(function(){
   $('.sub a').removeClass('active');
   $(this).addClass('active');
 }),
  $('.sub ul li a').click(function(){
   $('.sub ul li a').removeClass('active');
   $(this).addClass('active');
 });
});
$( function() {
  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 20,
    values: [ 0, 10 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "DKK " + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      var mi = ui.values[0];
      var mx = ui.values[1];
      filterSystem(mi, mx);
    }
  });
  $( "#amount" ).val( " DKK " + $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );
} );


function filterSystem(minPrice, maxPrice) {
  $(".products div.product-item").hide().filter(function () {
    var price = parseInt($(this).data("price"), 10);
    return price >= minPrice && price <= maxPrice;
  }).show();
}

