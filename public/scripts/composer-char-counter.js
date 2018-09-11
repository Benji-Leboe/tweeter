$(document).ready(function() {
  $("#composer").keyup(function(){
    let value = $(this).val();
    let counter = 140;
    counter -= value.length;
    if(counter < 0){
      $(this).siblings('.counter').replaceWith('<span class="counter text-red float-right">' + counter + '</span>');
    }else{
      $(this).siblings('.counter').replaceWith('<span class="counter float-right">' + counter + '</span>');
    }
  });
});


