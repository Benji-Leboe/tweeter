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


$(function(){
  composerCount();
  renderTweets();
  addTweet();
});

function composerCount(){
  $("#composer").on('input', function(){
    let value = $(this).val();
    let counter = 140;
    counter -= value.length;
    $(this).siblings('.counter').text(counter);
    if(counter < 0){
      $(this).siblings('.counter').addClass('text-error');
    }else{
      $(this).siblings('.counter').removeClass('text-error');
    }
  });
}



function createTweetElement(tweetObj) {
  
  const {user, content, created_at} = tweetObj;
  const {name, avatars, handle} = user;

  let timeAgo = convertMilliseconds((Date.now() - created_at));

  function convertMilliseconds(ms) {
    let day, hour, min, sec;
    sec = Math.floor(ms / 1000);
    min = Math.floor(sec / 60);
    sec = sec % 60;
    hour = Math.floor(min / 60);
    min = min % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return { day, hour, min, sec };
  };

  let dayMinHr = (function() {
    if(timeAgo.day > 365) {
      return `${Math.floor(timeAgo.day / 365)} years ago`;
    } else if (timeAgo.day > 30){
      return `${Math.floor(timeAgo.day / 30)} months ago`;
    } else if(timeAgo.day) {
      return `${timeAgo.day} days ago`;
    } else if (timeAgo.hour) {
      return `${timeAgo.hour} hours ago`;      
    } else if (timeAgo.min) {
      return `${timeAgo.min} minutes ago`;
    } else {
      return 'Just now';
    }
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



function renderTweets(){
    $.ajax('/tweets', {method: 'GET'}).then(function(tweetContent){
      for(let tweet of tweetContent){
        $(".tweets").prepend(createTweetElement(tweet));
      }
    });
}

function addTweet(){
  $("#compose-tweet").on('submit', function(event){
    event.preventDefault();
    content = $('#composer').serialize();
    $.ajax({url: '/tweets', method: 'POST', data: content}).then(function(){
      $('#composer').val('');
    }).done(renderTweets(), function(){
    });
  });
}
