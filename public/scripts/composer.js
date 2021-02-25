//Back to top button

$(document).ready(function() {

  const btn = $('#backToTopButton');

  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });

  btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
    $(".new-tweet").slideToggle("slow");
  });
});