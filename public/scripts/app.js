"use strict";

//document ready;
$(function() {
  composerCount();
  composerToggleBtn();
  showLogin();
  showRegister();
  getTweets();
  addTweet();
  showErrors();
  hideErrors();
  likeTweet();
  postRegister();
  // loginCheck();
});

//show/hide errors for addTweet conditionals
function showErrors(message) {
  $('.errors').text(message).slideDown(300);
}

function hideErrors() {
  $('.errors').val('').slideUp(200);
}

function composerCount() {
  
  $("#composer").on('input', function() {
    let value = $(this).val();
    let counter = 140;
    counter -= value.length;

    $(this).siblings('span.flex-row').children('.counter').text(counter);
    if (counter < 0) {
      $(this).siblings('span.flex-row').children('.counter').addClass('text-error');
    } else {
      $(this).siblings('span.flex-row').children('.counter').removeClass('text-error');
    }
  });
}

function composerToggleBtn() {
  $('.compose-toggle').click(function() {
    //hide error message on toggle;
    hideErrors();

    $('#compose-tweet').slideToggle(500, function() {
      let styleCheck = $('#compose-tweet').css("display");
      if (styleCheck === "block") {
        $('#composer').focus();
      }
    });
  });
}

function showLogin() {
  $('#loginBtn').click(function(event) {
    event.preventDefault();
    $('.register-field').css("display", "none");

    $('.login-field').slideToggle(500, function() {

      let styleCheck = $('.dropdown').css("display");
      if (styleCheck === "block") {
        $('#userLogin').focus();
      }
    });
  });
}

function showRegister() {
  $('#registerBtn').click(function(event) {
    event.preventDefault();
    $('.login-field').css("display", "none");

    $('.register-field').slideToggle(500, function() {

      let styleCheck = $('.dropdown').css("display");
      if (styleCheck === "block") {
        $('#userReg').focus();
      }
    });
  });
}

function postLogin() {

}

function postRegister() {
  $('.register-form').submit(function(event) {
    event.preventDefault();
    let formData = {
      'username': $('input[id=userReg]').val(),
      'handle': $('input[id=userHandle]').val(),
      'password': $('input[id=passwordReg]').val(),
      'passwordCheck': $('input[id=passwordConfirm]').val()
    };

    console.log(formData);
    $.ajax({
      url: '/tweets/register',
      method: 'POST',
      data: formData,
      success: function(data){
        console.log("success " + data);
      },
      error: function (req, status, error){
        console.log("Req: " + req);
        console.log("Status: " + status);
        console.log("Error: " + error);
      }
    }).done(function (msg) {
      console.log(msg);
    })
  })
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

function likeMaker(likes){
  let liked = Number(likes);
  console.log (liked, typeof liked);
  if (liked < 1) {
    return "Be the first to like this post!";
  } else if (liked === 1) {
    return "One person likes this.";
  } else {
    return `${liked} people like this.`;
  }
}

function createTweetElement(tweetObject) {
  
  //object deconstructors
  const { _id, user, content, created_at, likes } = tweetObject;

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
  let $id = _id;
  let $likes = likes;
  let $article = $("<article>").addClass('tweet-article flex-box');
  let $header = $("<header>").addClass('tweet-header flex-container');
  let $avatar = $("<img>").addClass('tweet-img flex-left').attr("src", avatars.small);
  let $name = $("<h3>").addClass('tweet-name flex-left').text(name);
  let $username = $("<p>").addClass('tweet-username flex-right').text(handle);
  let $body = $("<p>").addClass('tweet-body').text(content.text);
  let $liked = $('<p>').addClass('like-display flex-right').text("Be the first to like this post!");
  let $hr = $("<hr/>").addClass('tweet-rule');
  let $footer = $("<footer>").addClass('tweet-footer flex-row');
  let $time = $("<p>").addClass('footer-text flex-left').text(dayMinHr);
  let $footImgs = $("<span>").addClass('footer-imgs flex-right')
      .html(
        `<input class="img-submit flagTweet" type="image" src="/images/flag-tweet.png" />
        <input class="img-submit retweet" type="image" src="/images/retweet.png" />
        <input class="img-submit likeBtn" type="image" alt="submit" src="/images/heart-tweet.js.png" />`
      );

  $($article).append($header, $body, $liked, $hr, $footer);
  $($header).append($avatar, $name, $username);
  $($footer).append($time, $footImgs);
  
  $article.data('postID', $id);
  $article.data('likes', $likes);

  return $article;
}


function likeTweet(){
   
  //**TODO** CHANGE TO USERID FROM COOKIES
  //object to store individual post boolean
  //**TODO** FIX PERSISTENCE ISSUES WITH REMEMBERED LIKES
  let liked = {};

  $('#tweets-container').on('click', '.likeBtn', function() {

    let parentTweet = $(this).parents('.tweet-article');
    let targetID = parentTweet.find('.tweet-username').text();
    let tweetData = parentTweet.data();

    if(!liked[targetID]){
      liked[targetID] = false;
    }
    tweetData.likes = Number(tweetData.likes);

    liked[targetID] === false ? liked[targetID] = true : liked[targetID] = false;

    liked[targetID] === true ? tweetData.likes += 1 : tweetData.likes -= 1;
    
    let currentLikes = likeMaker(tweetData.likes);
    $.ajax({ 
      method: 'PUT', 
      url: '/tweets/likes',
      data: tweetData
      
    }).then( function() {
      parentTweet.find('p.like-display').val('').text(currentLikes);

    }).fail( function(err) {
      if (err) throw err;

    });
  });
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
    .css("display", "flex").children('.like-display')
    .css("display", "flex");
    $(this).dequeue();
  });
}

//add new tweet to top of list on submit
function prependTweet(tweet) {
  $('#tweets-container').ready(function() {
    $(".tweets").prepend( createTweetElement(tweet) );

  }).queue(function(next) {
    //animate new tweet on submission
    $('article.tweet-article')
    .first().slideDown(500);
    next();
  }).queue(function() {
    $('article.like-display').first()
    .css('opacity', 0)
    .fadeIn(600);
    console.log(this);
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
        composer.siblings('span.flex-row')
        .children('.counter').val('').text(140);
        console.log('Post request successful');
      });

    }
  });
}

function getCookie() {
  $.ajax('tweets/cookie', {
    method: 'GET'
  }).done(function(cookie) {
    return cookie;
  });
}

function cookieResponse(cookie, param) {
  if (cookie !== null){
    return cookie[param];
  }
  return null;
}

function loginCheck() {
  let cookie = getCookie();
  
  if (!cookie) {
    $('#nav-bar .logged-in').css('display', 'none');
    $('#nav-bar .logged-out').css('display', 'flex');
  } else {
    $('#nav-bar .logged-out').css('display', 'none');
    $('#nav-bar .logged-in').css('display', 'flex');
  }
}