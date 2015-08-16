/**
 * Created by rruettimann on 14.08.15.
 */

var game_values_template = ['a','a','a','b','b','b','c','c','c']

function init_game() {
  var board_size = Number($('#board_size').val());
  var fadeout_duration = Number($('#fadeout_duration').val());
  console.log(fadeout_duration);
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
  generate_game_values(board_size);
  shuffle_game_values();
  hide_all_cards(fadeout_duration*1000);
}

function generate_board(board_size) {
  // board_size should be an integer >= 2 and <= 26.
  var board_tbl = $("#board_tbl")
  board_tbl.html("");
  for (var i=0; i < board_size; i++) {
    var row = $('<div id="row' + i + j + '" class="row"></div>');
    board_tbl.append(row);
    for (var j=0; j < board_size; j++) {
      var cell = $('<div id="r' + i + 'c' + j + '" class="cell"></div>');
      var card = $('<div id="card' + (i*board_size + j) + '" class="card"></div>');
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
  game_values_template = [];
  for (var i = 0; i < board_size; i++) {
    var sym = String.fromCharCode("a".charCodeAt(0) + i);
    for (var j = 0; j < board_size; j++) {
      game_values_template.push(sym);
    }
  }
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

function gameStep(event) {
    play_sound();
    if ($(event.target).prop('tagName') === 'DIV') {
        $(event.target).toggleClass('open-card').css('opacity', '100');
    } else if ($(event.target).prop('tagName') === 'SPAN') {
        $(event.target).parent().toggleClass('open-card').css('opacity', '100');
    }
    $(event.target).off('click');
    var eval_value = $('#board').data('card_value');
    var game_over = false;
    $('.open-card').each(function () {
        if ($(this).text() != eval_value) {
            $('.card').off('click');
            $('#board_tbl').prepend('<div id="end-message"><h2><span>Game Over!</span></h2></div>');
            $(this).css('background-color','salmon');
            game_over = true;
        }
    })
    if (($('.open-card').length === Number($('#board_size').val()) ) && (! game_over)) {
        $('.card').off('click');
        $('#board_tbl').append('<div id="end-message"><h2><span>You have won!</span></h2></div>');

    }
}

function shuffle_game_values(){
    var game_values = shuffle(game_values_template.slice());
    $('.card').each(function( index ) {
        //$(this).text('test');
        $(this).html('<span>' + game_values.pop() + '</span>');
    })
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
      $(this).click(gameStep); // Add click event when all cards are hidden.
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
