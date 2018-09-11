$(document).ready(function() {
  $("#composer").keyup(function(){
    let value = $(this).val();
    let counter = 140;
    counter -= value.length;
    if(value.length < 140){
      //make text red
    }
    $(this).siblings('.counter').replaceWith('<span class="counter float-right">' + counter + '</span>')
    
    console.log(counter);
  });
});


