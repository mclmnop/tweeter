/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// returns strings for when the post what made 1-today, 2-yesterday, 3- x days ago, 4- x day x months ago.
const calculateTimeAgo = function(dateCreated) {
  const now = new Date(Date.now());
  if (now.getMonth() === dateCreated.getMonth() && now.getDate() === dateCreated.getDate()) {
    if (now.getMinutes() === dateCreated.getMinutes()) {
      return `few seconds ago`;
    } else if (now.getHours() === dateCreated.getHours()) {
      return `${now.getMinutes() - dateCreated.getMinutes()} minute(s) ago`;
    } else {
      return `${now.getHours() - dateCreated.getHours()} hour(s) ago`;
    }
  } else if (now.getMonth() === dateCreated.getMonth() && now.getDate() - dateCreated.getDate() === 1) {
    return 'yesterday';
  } else if (now.getMonth() === dateCreated.getMonth()) {
    return (`${now.getDate() - dateCreated.getDate()} days ago`);
  } else if (now.getYear() === dateCreated.getYear()) {
    return (`${now.getDate() - dateCreated.getDate()} days ${now.getMonth() - dateCreated.getMonth()} month(s) ago`);
  } else {
    return 'too long ago';
  }
};

/* Escape function to prevent script injection by a user */
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
      <p class="article footer">
        <a title="Flag">&#9872</a>
        <a title="Re-tweet">&#x21c4</a>
        <a title="Like">&#10084</a>
      </p>
    </footer>
    </article>
    <br><br>
    `;
    return tweetArticle;
  };

  //loops through an array of tweets to post them one after the other
  const renderTweets = function(tweetArray) {
    for (let tweet of tweetArray) {
      const renderedTweet = createTweetElement(tweet);
      $('.tweets').append(renderedTweet);
    }
  };

  //load all tweets from fake db on load, reverses order to post last on first
  const loadTweets = function() {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
    })
      .done((result) => {
        const sorted = result.reverse();
        renderTweets(sorted);
      })
      .fail((err) => console.log(err.message));
  };
  loadTweets();

  //toggle composing space for new tweet
  $('.composeButton').on("click", function() {
    $(".new-tweet").slideToggle("slow");
  });

  //event listener for new tweets, posts result when submit
  $('form').on('submit', function(event) {

    // prevent the default behavior of the form submission
    event.preventDefault();

    // captures the content of the tweet
    const serialize = $(this).serialize();
    const input = serialize.substring(5);
  
    //validates if input is ok before submitting
    if (input.length > 140) {
      $('#errMessage').text('Tweet is over 140 characters');
    } else if (input === "") {
      $('#errMessage').text('Your tweet is empty, please hum something');
    } else {
      //post the user's tweet to save it to the db
      $.ajax({
        url: 'http://localhost:8080/tweets',
        method: 'POST',
        data: serialize,
      })
        .done((result) => {
          //reloads page after post to see new tweet
          location.reload();
        })
        .fail((err) => console.log(err.message));
    }
  });
});
