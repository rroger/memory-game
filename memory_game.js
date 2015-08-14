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
    $(event.target).toggleClass('open-card').css('opacity','100');
    $(event.target).off('click');
    var eval_value = $('#board').data('card_value');

    $('.open-card').each(function () {
        if ($(this).text() != eval_value) {
            $('.card').off('click');
            $('#board_tbl').prepend('<div class="end-message"><h2>Game Over!</h2></div>');
            $(this).css('background-color','salmon')
        }
    })
    if ($('.open-card').length === 3) {
        $('#board_tbl').append('<div class="end-message"><h2>You have won</h2></div>');
        $('.card').off('click');
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
    $('.card').fadeTo(fadeout_duration, 0);
    // Use Timeout instead of function callback in fadeOut, because in fadeOut it would be called for
    // each element in .card set.
    setTimeout(add_click_event_to_cards, fadeout_duration);
    setTimeout(function () {
        var searched_card_value = get_random_card_value();
        $('#board').data('card_value', searched_card_value);
        $('#header').append('<h3>Please open cards with ' + searched_card_value + '</h3>');
    }, fadeout_duration);

}



function add_click_event_to_cards() {

    $('.card').each(function () {
        console.log("added for");
        console.log($(this));
        $(this).click(gameStep);
    })

}

function play_sound() {
    var snd = new Audio("sound.mp3");
    snd.play();
}

