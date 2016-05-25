'use strict';

$(document).ready(function() {
  var serviceRoot = 'http://localhost:9000/HirsiServer_JAX-RS/services/words/';
  var alphapets = 'ABCDEFGHIJKLMNOPQRSTUVXYZÅÄÖ'.split('');
  var maxErrors = 9;
  var errorCount = 0;
  var wordLength = 0;
  var wordId = 0;
  var startTime;

  gameStarted();

  $.getJSON({url: serviceRoot + 'getWord'}).then(function(data) {
    wordId = data.id;
    wordLength = data.length;

    for (var i = 0; i < wordLength; i++) {
      var hiddenLetter = $('<button></button>',
        {id: 'hiddenLetter' + i, class: 'hiddenLetter'}).text('*');
      hiddenLetter.attr('data-hidden', true);
      hiddenLetter.attr('disabled', true);

      $('#hiddenLetters').append(hiddenLetter);
    }

    $('#hiddenLetters').show();

    startTime = new Date().getTime() / 1000;
  });

  for (var i = 0; i < alphapets.length; i++) {
    var button = $('<button></button>').text(alphapets[i]);

    button.attr('id', 'letter' + alphapets[i]);
    button.attr('class', 'letter');
    button.attr('data-state', 'notClicked');

    button.click((function(btn, letter) {
      return function() {
        checkLetter(btn, letter);
      };
    })(button, alphapets[i]));

    $('#inputLetters').append(button);
  }

  $('body').keydown(function(e) {
    var letter = String.fromCharCode(e.keyCode);

    if (isLetter(letter)) {
      if (e.keyCode === 221) {
        letter = 'Å';
      }
      if (e.keyCode === 222) {
        letter = 'Ä';
      }
      if (e.keyCode === 192) {
        letter = 'Ö';
      }

      var btn = $('#letter' + letter);

      if (btn.prop('disabled')) {
        return;
      }

      checkLetter(btn, letter);
    }
  });

/**
 * Checks if the given character is a letter.
 *
 * @param {character} c Character.
 * @return {boolean} Is the given character a valid letter.
 */
  function isLetter(c) {
    return c.length === 1 && c.toLowerCase() !== c.toUpperCase();
  }

/**
 * Sets up the new game started state.
 *
 */
  function gameStarted() {
    $('#gameFinished').hide();
    $('#hiddenLetters').hide();
    $('#hiddenLetters').removeClass('hiddenLetter');
  }

/**
 * Sets up the game finished state.
 *
 * @param {boolean} isVictory Result of the game.
 */
  function gameFinished(isVictory) {
    $('.letter').attr('disabled', true);

    var newGameBtnText;
    var effect;

    if (isVictory) {
      $('#gameFinished').append(
        $('<b></b>').text('Onneksi olkoon, voitit pelin!'));
      $('#gameFinished').append($('<br>'));
      $('#gameFinished').append(
        $('<p></p>').text(
          'Teit yhteensä ' + errorCount + ' virheellistä valintaa.'));
      $('#gameFinished').append(
        $('<p></p>').text('Käytit aikaa ' + getUsedTimeStr(startTime)));
      $('#gameFinished').append($('<br>'));

      newGameBtnText = 'Aloita uusi peli';
      effect = 'bounce';
    } else {
      $('#gameFinished').append($('<b></b>').text('Aijai, hävisit pelin!'));
      $('#gameFinished').append($('<br>'));
      $('#gameFinished').append($('<br>'));

      newGameBtnText = 'Yritä uudelleen';
      effect = 'shake';
    }

    var newGamebutton = $('<button></button>').text(newGameBtnText);
    newGamebutton.attr('class', 'gameButton');

    newGamebutton.click(function() {
      document.location.reload(true);
    });

    $('#gameFinished').append(newGamebutton);
    $('#gameFinished').show(1000);
    $('#gameFinished').effect(effect);
  }

/**
 * Returns the time between current time and startTime as a String.
 *
 * @param {number} startTime Start time of the game in seconds.
 * @return {String} The elapsed time.
 */
  function getUsedTimeStr(startTime) {
    var endTime = new Date().getTime() / 1000;
    var diff = endTime - startTime;

    var seconds = Math.round(diff % 60);
    diff = Math.floor(diff / 60);

    if (diff > 0) {
      var minutes = Math.round(diff % 60);
      return minutes + ' min. ' + seconds + ' s.';
    }

    return seconds + ' s.';
  }

/**
 * Checks if the given letter is found in the word to be discovered.
 *
 * @param {Button} btn Button that this query relates to.
 * @param {String} letter Letter related to the given button.
 */
  function checkLetter(btn, letter) {
    $.getJSON({
      url: serviceRoot + 'letterInWord/' + wordId,
      data: {letter: letter}
    }).then(function(data) {
      var indexes = [];

      btn.attr('disabled', true);
      $.each(data, function(key) {
        indexes.push(key);
      });

      if (indexes.length > 0) {
        btn.attr('data-state', 'correct');

        btn.animate({
          color: 'green'
        }, 400, 'easeOutElastic');

        for (var i = 0; i < indexes.length; i++) {
          $('#hiddenLetter' + indexes[i]).text(' ' + letter + ' ');
          $('#hiddenLetter' + indexes[i]).attr('data-hidden', false);

          $('#hiddenLetter' + indexes[i]).effect('highlight');
        }

        if ($('.hiddenLetter[data-hidden=true]').length === 0) {
          $('#statusImage').attr('src', 'images/image_vic.png');
          gameFinished(true);
        }
      } else {
        btn.attr('data-state', 'incorrect');
        errorCount++;

        btn.animate({
          color: 'red'
        }, 400, 'easeOutElastic');

        $('#statusImage').attr('src', 'images/image' + errorCount + '.png');

        if (errorCount > maxErrors) {
          gameFinished(false);
        }
      }
    });
  }
});
