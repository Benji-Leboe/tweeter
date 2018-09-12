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


$(function(){
  composerCount();
  tweetListener(tweetObj);
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

  let timeAgo = convertMS((Date.now() - created_at));

  function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return { d: d, h: h, m: m, s: s };
  };

  let DHM = (function() {
    if(timeAgo.d) {
      return `${timeAgo.d} days ago`;
    } else if (timeAgo.h) {
      return `${timeAgo.h} hours ago`;      
    } else if (timeAgo.m) {
      return `${timeAgo.m} minutes ago`;
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
  let $time = $("<p>").addClass('footer-text float-left').text(DHM);
  let $footImgs = $("<span>").addClass('footer-imgs float-right').html('<img src="/images/flag-tweet.png"></img><img src="/images/retweet.png"><img src="/images/heart-tweet.js.png">');

  $($article).append($header, $body, $hr, $footer);
  $($header).append($avatar, $name, $username);
  $($footer).append($time, $footImgs);

  return $article;
}

function tweetListener(tweetObj){
  $("#submit-form").on('submit', function(event){
    event.preventDefault();
    // $("#submit-form").val();
    $(".tweets").prepend(createTweetElement(tweetObj));
  });
}

function renderTweets(tweetArr){
  tweetArr.forEach(function(tweet){
    $("#tweet-container").prepend(createTweetElement(tweet));
  });
}