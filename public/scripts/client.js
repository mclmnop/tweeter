/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// returns strings for when the post what made, 10 days ago, 10 months, etc
const calculateTimeAgo = function(dateCreated) {
  const now = new Date(Date.now());
  //console.log(now, dateCreated.getDate())
  if (now.getMonth() === dateCreated.getMonth() && now.getDate() === dateCreated.getDate()){
      return 'today';
  } else if (now.getMonth() === dateCreated.getMonth() && now.getDate() - dateCreated.getDate() === 1){
      return 'yesterday';
  } else if (now.getMonth() === dateCreated.getMonth()){
      const difference = now.getDate() - dateCreated.getDate();
      return (`${difference} days ago`);
  } else if (now.getYear() === dateCreated.getYear()){
      const differenceDays = now.getDate() - dateCreated.getDate();
      const differenceMonths = now.getMonth() - dateCreated.getMonth();
      return (`${differenceDays} days ${differenceMonths} month(s) ago`);
  } else {
    return 'too long ago';
  }
}

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {

  //creates the HTML content for one tweet
  const createTweetElement = function(tweet) {
    const dateToConvert = new Date(tweet.created_at);
    const date = calculateTimeAgo(dateToConvert);
    const tweetArticle = `
    <article>
    <header>
      <p><img src=${tweet.user.avatars}>${tweet.user.name}</p>
      <p id="userID">${tweet.user.handle}</p>
    </header>
    <div class="databaseTweet">
    <div class="tweet">
      <p>${escape(tweet.content.text)}</p>
    </div>
    <footer>
      <p>${date}</p>
      <p class="article footer">&#9872 &#x21c4 &#10084</p>
    </footer>
    </article>
    <br><br>
    `
    return tweetArticle;
  }

  //loops through an array of tweets to post them one after the other
  const renderTweets = function(tweetArray) {
    //console.log(tweetArray);
    for(let tweet of tweetArray) {
      const renderedTweet = createTweetElement(tweet);
      $('.tweets').append(renderedTweet);
    }
  };

  //load all tweets from fake db on load  
  const loadTweets = function() {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
    })
      .done((result) => {
        console.log('result',result.reverse());
        renderTweets(result)
      })
      .fail((err) => console.log(err.message));
  }
  loadTweets();

  //toggle composing space for new tweet, desktop version
  $('.composeButton').on("click", function() {
    alert('allo?')
    $(".new-tweet").slideToggle( "slow" );
  })


  //event listener for new tweets, posts result when submit
  $('form').on('submit', function(event) {

    // prevent the default behavior of the form submission
    event.preventDefault();

    // capture the content of the tweet
    const serialize = $(this).serialize();
    const input = serialize.substring(5);
    // console.log('serial',serialize.substring(5));
  
    if (input === "") {
      $('#errMessage').text('Your tweet is empty, please hum something');
    } else if (input.length > 140) {
      $('#errMessage').text('Tweet is over 140 characters');
    } else {
      //post the user's tweet to save it to the db
      $.ajax({
        url: 'http://localhost:8080/tweets',
        method: 'POST',
        data: serialize,
      })
        .done((result) => {
          console.log('result',result);
          location.reload(true);
        })
        .fail((err) => console.log(err.message));
    }
  })

});
