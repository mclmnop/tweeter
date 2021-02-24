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

$(document).ready(function() {

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
      <p>${tweet.content.text}</p>
    </div>
    <footer>
      <p>${date}</p>
      <p>Likes</p>
    </footer>
    </article>
    <br><br>
    `
    return tweetArticle;
  }

  const renderTweets = function(tweetArray) {
    //console.log(tweetArray);
    for (let tweet of tweetArray) {
      //console.log('inside loop',tweet)
      const renderedTweet = createTweetElement(tweet);
      $('.tweets').append(renderedTweet);
    }
  }
  //renderTweets(tweetData);

  //event listener for new tweets, posts result when submit
  $('form').on('submit', function(event) {
    // prevent the default behavior of the form submission
    event.preventDefault();

    // capture the content of the tweet
    const serialize = $(this).serialize()

    //post the user's to save it to the db
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'POST',
      data: serialize,
    })
      .done((result) => {
        console.log('result',result);
      })
      .fail((err) => console.log(err.message));
  })

  const loadTweets = function() {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
    })
      .done((result) => {
        //console.log('result',result);
        renderTweets(result)
      })
      .fail((err) => console.log(err.message));
  }
  loadTweets();

});
