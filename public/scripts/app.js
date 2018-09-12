/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(function(){
  composerCount();
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

function createTweetElement(obj) {
  let userObj = obj.user;
  let content = obj.content;
  let timestamp = obj.created_at;
  let name = userObj.name;
  let avatars = userObj.avatars;
  let handle = userObj.handle;

  let $article = $("<article>").addClass('tweet-article');
  let $header = $("<header>").addClass('tweet-header group');
  let $avatar = $("<img>").addClass('tweet-img float-left').attr("src", avatars.small);
  let $name = $("<h3>").addClass('tweet-name float-left').text(name);
  let $username = $("<p>").addClass('tweet-username float-right').text(handle);
  let $body = $("<p>").addClass('tweet-body').text(content);
  let $hr = $("<hr/>").addClass('tweet-rule');
  let $footer = $("<footer>").addClass('tweet-footer group');
  let $time = $("<p>").addClass('footer-text float-left').text(timestamp);
  let $footImgs = $("<span>").addClass('footer-imgs float-right');
}

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