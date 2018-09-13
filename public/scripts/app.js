/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
let tweetObj = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}

const tweetArr = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


$(function() {
  composerCount();
  composerToggle();
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
    if(counter < 0) {
      $(this).siblings('.counter').addClass('text-error');
    } else {
      $(this).siblings('.counter').removeClass('text-error');
    }
  });
}



function createTweetElement(tweetObj) {
  
  const {user, content, created_at} = tweetObj;
  const {name, avatars, handle} = user;

  let timeAgo = convertMilliseconds((Date.now() - created_at));

  function convertMilliseconds(ms) {
    let sec = Math.floor(ms / 1000);
    let min = Math.floor(sec / 60);
    let hour = Math.floor(min / 60);
    let day = Math.floor(hour / 24);
    let month = Math.floor(day / 30);
    let year = Math.floor(day / 365);

    return { year, month, day, hour, min, sec};
  }


  let dayMinHr = (function() {
    let output = "Just now";
    if(timeAgo.day > 365) {
      output = `${timeAgo.year} year`;
    } else if (timeAgo.day > 30){
      output = `${timeAgo.month} month`;
    } else if(timeAgo.day > 0) {
      output = `${timeAgo.day} day`;
    } else if (timeAgo.hour > 0) {
      output = `${timeAgo.hour > 0} hour`;      
    } else if (timeAgo.min > 0) {
      output = `${timeAgo.min} minute`;
    } 
    if(output.slice(0,2) !== '1 ' && output !== "Just now"){
      output += 's';
    }
    return (output == "Just now" ? output : output += " ago");
  })();

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

function composerToggle() {
  $('.compose-button').click(function() {
    $('#compose-tweet').slideToggle(500, function() {
      let styleCheck = $('#compose-tweet').css("display");
      if(styleCheck === "block") {
        $('#composer').focus();
      }
    });
  });
}

function renderTweets(tweetContent) {
  $('#tweets-container').ready(function() {
    for(let tweet of tweetContent) {
      $(".tweets").prepend(createTweetElement(tweet));
    }
  }).queue(function(){
    $('article.tweet-article').first().slideDown(500);
    $(this).dequeue();
  });
}

function getTweets() {
  let tweetContent;
  $.ajax('/tweets', { method: 'GET' }).then(function(data) {
    tweetContent = data;
  }).done(function() {
    renderTweets(tweetContent);
  });
}

function addTweet() {
  $("#compose-tweet").on('submit', function(event) {
    event.preventDefault();
    let composer = $('#composer');
    if (!composer.val()) {
      showErrors("Please enter a tweet!");
    } else if (composer.val().length > 140) {
      showErrors("Your post is over 140 characters!");
    } else {
      hideErrors();
      let content = composer.serialize();
      $.ajax({ url: '/tweets', method: 'POST', data: content }).then(function() {
        $('#composer').val('');
      }).done(getTweets, function() {
        composer.siblings('.counter').val('').text(140);
        console.log('Post request successful');
      });
    }
  });
}

function showErrors (message) {
  $('.errors').text(message).slideDown(300);
}

function hideErrors() {

  $('.errors').val('').slideUp(300);
}