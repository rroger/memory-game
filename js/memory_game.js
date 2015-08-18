/**
 * Created by rruettimann on 14.08.15.
 */

//var game_values_template = ['a','a','a','b','b','b','c','c','c']

function init_game() {
  var board_size = Number($('#board_size').val());
  var fadeout_duration = Number($('#fadeout_duration').val());

  //Check input values:
  if ( ! ( ( board_size >= 2 ) && ( board_size <= 26 ) ) ) {
    alert("Please type a game size >= 2!");
    return;
  }
  if ( ! ( fadeout_duration >= 0.4 ) ) {
    alert("Please type a fadeout duration >= 0.4 secs!");
    return;
  }
  
  generate_board(board_size);
  adapt_style(board_size);
  clear_value_to_search();
  hide_all_cards(fadeout_duration*1000);
}

function generate_board(board_size) {
  // board_size should be an integer >= 2 and <= 26.
  var game_values = generate_game_values(board_size);
  game_values = shuffle(game_values);
  var board_tbl = $("#board_tbl")
  board_tbl.html("");
  for (var i=0; i < board_size; i++) {
    var row = $('<div id="row' + i + '" class="row"></div>');
    board_tbl.append(row);
    for (var j=0; j < board_size; j++) {
      var cell = $('<div id="r' + i + 'c' + j + '" class="cell"></div>');
      var card = $('<div id="card' + (i*board_size + j) + '" class="card"></div>');
      var game_value = game_values.pop();
      card.html('<span>' + game_value + '</span>');
      $(card).toggleClass(game_value);
      cell.append(card);
      row.append(cell);
    }
  }
}

function adapt_style(board_size) {
  // board_size should be an integer >= 2 and <= 26.
  jss.set('.cell', {
    'width': (100/board_size).toString() + '%',
    'height': (100/board_size).toString() + '%',

  });
  jss.set('.row', {
    'width': '100%',
    'height': (100/board_size).toString() + '%',

  });
  if (board_size < 7) {
    jss.set('.table', {
      'width': '600px',
      'height': '600px',
    });
    jss.set('#end-message', {
      'top': '100px',
      'left': '100px',
      'width': '400px',
      'height': '400px',
    });
  } else {
    jss.set('.table', {
      'width': (board_size*100).toString() + 'px',
      'height': (board_size*100).toString() + 'px',
    });
    jss.set('#end-message', {
      'top': '150px',
      'left': '150px',
      'width': (board_size*100 -300).toString() + 'px',
      'height': (board_size*100 -300).toString() + 'px',
    });
  }
}

function generate_game_values(board_size) {
  // board_size should be an integer >= 2 and <= 26.
  var game_values = [];
  for (var i = 0; i < board_size; i++) {
    var sym = String.fromCharCode("a".charCodeAt(0) + i);
    for (var j = 0; j < board_size; j++) {
      game_values.push(sym);
    }
  }
  return game_values;
}

function shuffle(array_) {
    /* http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     */
    var array = array_.slice(0);
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function clear_value_to_search() {
  $('#search-value-box').html('&nbsp;');
}

function game_step(event) {
    play_sound();
    turn_card(event);
    var game_status = get_game_status(event);

    if (game_status === 'won') {
      game_won();
    } else if (game_status === 'game_over') {
      game_over();
    }
}

function get_game_status(event) {
  var eval_value = $('#board').data('card_value');

  if ($('.open-card.' + eval_value).length != $('.open-card').length) {
    // this means there is a card open, that has an other card value than
    // the searched card value, ergo it's game over.
    return 'game_over';
  }

  if ($('.open-card').length === Number($('#board_size').val()) ) {
    return 'won';
  }
  return 'undecided';
}

function game_won(){
  $('.card').off('click');
  $('#board_tbl').append('<div id="end-message"><h2><span>You have won!</span></h2></div>');
  $(".card:not(.open-card)").css('background-color','#D1E0E0').css('opacity','0.10');
}

function game_over(){
  $('.card').off('click');
  $('#board_tbl').prepend('<div id="end-message"><h2><span>Game Over!</span></h2></div>');
  $('.open-card:not(.' + $('#board').data('card_value') +')').css('background-color','salmon');
  $(".card:not(.open-card)").css('background-color','#D1E0E0').css('opacity','0.10');
}

function turn_card(event){
  if ($(event.target).prop('tagName') === 'DIV') {
      $(event.target).toggleClass('open-card').css('opacity', '100');
  } else if ($(event.target).prop('tagName') === 'SPAN') {
      $(event.target).parent().toggleClass('open-card').css('opacity', '100');
  }
  $(event.target).off('click');
}

function get_random_card_value(board_size) {
    var rand = Math.random();
    var board_size = Number($('#board_size').val());
    for (var i = 0; i < board_size; i++) {
      if (rand < ((i+1)/board_size)){
        return String.fromCharCode("a".charCodeAt(0) + i);
      }
    }
}

function hide_all_cards(fadeout_duration) {
    if ( fadeout_duration === undefined ) {
        fadeout_duration = 5000;
    }

    $('.card').fadeTo(fadeout_duration, 0, function(){
      $(this).click(game_step); // Add click event when all cards are hidden.
    });

    // Use Timeout instead of function callback in fadeTo, because
    // the code below should only be called once and not for every card.
    setTimeout(function () {
        var searched_card_value = get_random_card_value();
        $('#board').data('card_value', searched_card_value);
        $('#search-value-box').text('Please open cards with ' + searched_card_value + '.');
    }, fadeout_duration);

}

function play_sound() {
    var snd = new Audio("media/turn_card.mp3");
    snd.play();
}
