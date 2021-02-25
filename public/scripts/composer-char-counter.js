//

$(document).ready(function() {

  //get text zone
  const textZone = $("form");
  
  //event listener triggered a key is pressed in the text zone
  textZone.on("keydown", function(event) {

    //get the length of the text input using the text box which is a child
    const text = $(this).find('#tweet-text');

    //the counter shows the characters left to respect the 140 limit
    let charCount = 140 - text.val().length;

    //set the good value to counter, and make it turn red when negative
    let counter = $(this).find('.counter').val(charCount);

    if (charCount < 0) {
      counter.addClass("counterRed");
    }
    if (charCount > 0 && counter.hasClass("counterRed")) {
      counter.removeClass("counterRed");
    }
  });
});