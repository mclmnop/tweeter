$(document).ready(function() {

  //get text ZoneInput
  const textZone = $("form");
  //const textZone = $(".textInput");
  
  //get the length of the input by finding the text box which is a child
  textZone.on("keydown", function(event) {
    const text = $(this).find('#tweet-text');
    let charCount = 140 - text.val().length;

    //set the good value to counter, and meke it turn red when negative
    let counter = $(this).find('.counter').val(charCount);
    if (charCount < 0) {
      counter.addClass("counterRed");
    }
    if (charCount > 0 && counter.hasClass("counterRed")) {
      counter.removeClass("counterRed");
    }
  });
});