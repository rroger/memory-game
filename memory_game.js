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
    $(event.target).children('div').toggleClass('open-card').css('display','block');
    var count = 0
    var test = $('#board').data('card_value');

    $('.open-card').each(function () {
        if ($(this).text() != test) {
            $('#header').append('<h2>Game over!</h2>');
            alert('Game Over');
            $('body').html('<h1>Game Over!</h1>');
        }
    })
    if ($('.open-card').length === 3) {
        $('body').html('<h1>You have won</h1>');
    }
}

function shuffle_game_values(){
    var game_values = shuffle(GAME_VALUES.slice());
    $('.card').each(function( index ) {
        //$(this).text('test');
        $(this).text(game_values.pop());
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
    $('.card').fadeOut(fadeout_duration, function () {
        add_click_event_to_cards();
        var searched_card_value = get_random_card_value();
        $('#board').data('card_value', searched_card_value);
        $('#header').append('<h3>Please open cards with ' + searched_card_value + '</h3>');

    });
    //setTimeout(add_click_event_to_cards, fadeout_duration);
}



function add_click_event_to_cards() {

    $('.td').each(function () {
        console.log("added for");
        console.log($(this));
        $(this).click(gameStep);
    })

}

function play_sound() {
    var snd = new Audio("sound.mp3");
    snd.play();
}

