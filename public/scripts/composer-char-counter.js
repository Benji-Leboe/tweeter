$(document).ready(function() {
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


