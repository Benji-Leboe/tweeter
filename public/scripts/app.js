"use strict";

//document ready;
$(function() {
  composerCount();
  composerToggleBtn();
  getTweets();
  addTweet();
  showErrors();
  hideErrors();
});

function composerCount() {
  $("#composer").on('input', function() {

    let value = $(this).val();
    let counter = 140;
    counter -= value.length;

    $(this).siblings('.counter').text(counter);
    if (counter < 0) {
      $(this).siblings('.counter').addClass('text-error');
    } else {
      $(this).siblings('.counter').removeClass('text-error');
    }
  });
}

function composerToggleBtn() {
  $('.compose-button').click(function() {
    $('#compose-tweet').slideToggle(500, function() {
      let styleCheck = $('#compose-tweet').css("display");
      if (styleCheck === "block") {
        $('#composer').focus();
      }
    });
  });
}

function convertMilliseconds(ms) {
  
  let sec = Math.floor(ms / 1000);
  let min = Math.floor(sec / 60);
  let hour = Math.floor(min / 60);
  let day = Math.floor(hour / 24);
  let month = Math.floor(day / 30);
  let year = Math.floor(day / 365);

  return { year, month, day, hour, min, sec };
}

function createTweetElement(tweetObject) {
  
  //object deconstructors
  const { user, content, created_at } = tweetObject;

  const { name, avatars, handle } = user;

  //calculate time from post timestamp
  let timeAgo = convertMilliseconds( (Date.now() - created_at) );

  //"x" time ago constructor IIFE
  let dayMinHr = (function timeAgoCalculator() {

    let output = "Just now";
    if(timeAgo.day > 365) {
      output = `${timeAgo.year} year`;

    } else if (timeAgo.day > 30) {
      output = `${timeAgo.month} month`;

    } else if(timeAgo.day > 0) {
      output = `${timeAgo.day} day`;

    } else if (timeAgo.hour > 0) {
      output = `${timeAgo.hour} hour`;
            
    } else if (timeAgo.min > 0) {
      output = `${timeAgo.min} minute`;
    }
    //check for plural and append "s"
    if (output.slice(0,2) !== '1 ' && output !== "Just now") {
      output += 's';
    }
    //ternary conditional to add "ago" on change
    return (output === "Just now" ? output : output += " ago");
  })();

  //dynamic HTML constructor
  let $article = $("<article>").addClass('tweet-article');
  let $header = $("<header>").addClass('tweet-header group');
  let $avatar = $("<img>").addClass('tweet-img float-left').attr("src", avatars.small);
  let $name = $("<h3>").addClass('tweet-name float-left').text(name);
  let $username = $("<p>").addClass('tweet-username float-right').text(handle);
  let $body = $("<p>").addClass('tweet-body').text(content.text);
  let $hr = $("<hr/>").addClass('tweet-rule');
  let $footer = $("<footer>").addClass('tweet-footer group');
  let $time = $("<p>").addClass('footer-text float-left').text(dayMinHr);
  let $footImgs = $("<span>").addClass('footer-imgs float-right').html('<img src="/images/flag-tweet.png"></img><img src="/images/retweet.png"><img src="/images/heart-tweet.js.png">');

  $($article).append($header, $body, $hr, $footer);
  $($header).append($avatar, $name, $username);
  $($footer).append($time, $footImgs);

  return $article;
}

//render existing tweets from database on load/refresh
function renderTweets(tweetContent) {

  $('#tweets-container').ready(function() {
    for (let tweet of tweetContent) {
      $(".tweets").prepend( createTweetElement(tweet) );
    }

  }).queue(function() {
    //conditional removing css "display: none" default for first child
    $('article.tweet-article').first()
    .css("display", "block");
    $(this).dequeue();
  });
}

//add new tweet to top of list on submit
function prependTweet(tweet) {
  $('#tweets-container').ready(function() {
    $(".tweets").prepend( createTweetElement(tweet) );

  }).queue(function() {
    //animate new tweet on submission
    $('article.tweet-article')
    .first().slideDown(500);
    $(this).dequeue();
  });
}

//calls render tweets on document ready
function getTweets() {
  $.ajax('/tweets', { method: 'GET' })
  .done(function(data) {
    renderTweets(data);
  });
}

//show/hide errors for addTweet conditionals
function showErrors(message) {
  $('.errors').text(message).slideDown(300);
}

function hideErrors() {
  $('.errors').val('').slideUp(300);
}

//add tweet to database and call prepend tweet function
function addTweet() {

  //allow submit tweet on enter key + prevent default newline
  $('#composer').keydown(function (event) {
    if (event.which == 13) {
      event.preventDefault();
      $('#compose-tweet').submit();
      return false; 
    }
  });

  //new tweet submission logic
  $("#compose-tweet").on('submit', function(event) {
    //prevent default submit redirect
    event.preventDefault();

    let composer = $('#composer');

    if (!composer.val()) {
      showErrors("Please enter a tweet!");

    } else if (composer.val().length > 140) {
      showErrors("Your post is over 140 characters!");

    } else {
      //clear errors on success
      hideErrors();

      //sanitize composer input
      let content = composer.serialize();

      //post to DB
      $.ajax({ url: '/tweets', method: 'POST', data: content,
        //on successful request get request body 
        //from saveTweet cb in tweets.js 
        success: function(tweet) {
          prependTweet(tweet);
        }

      }).then(function() {
        //empty new tweet field
        $('#composer').val('');

      }).done(function() {
        //reset character counter
        composer.siblings('.counter').val('').text(140);
        console.log('Post request successful');
      });

    }
  });
}