/**
 * Created by rruettimann on 14.08.15.
 */

var GAME_VALUES = ['a','a','a','b','b','b','c','c','c']

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
            $('#board_tbl').prepend('<div class="end-message"><h2><span>Game Over!</span></h2></div>');
            $(this).css('background-color','salmon');
            game_over = true;
        }
    })
    if (($('.open-card').length === 3 ) && (! game_over)) {
        $('.card').off('click');
        $('#board_tbl').append('<div class="end-message"><h2><span>You have won!</span></h2></div>');

    }
}

function shuffle_game_values(){
    var game_values = shuffle(GAME_VALUES.slice());
    $('.card').each(function( index ) {
        //$(this).text('test');
        $(this).html('<span>' + game_values.pop() + '</span>');
    })
}

function get_random_card_value() {
    var rand = Math.random();

    if (rand < 0.33) return 'a';
    if (rand >=  0.66) return 'b';
    return 'c';
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
    var snd = new Audio("turn_card.mp3");
    snd.play();
}
