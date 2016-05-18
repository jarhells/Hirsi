"use strict";

$( document ).ready(function() {

	var serviceRoot = 'http://localhost:9000/HirsiServer_JAX-RS/services/words/'
	var alphapets = 'ABCDEFGHIJKLMNOPQRSTUVXYZÅÄÖ'.split('');

	var maxErrors = 9;
	var errorCount = 0;
	var wordLength = 0;
	var wordId = 0;
	var start_time;

	gameStarted();

	$.getJSON({
        url: serviceRoot + 'getWord'
    }).then(function(data) 
    {
    	wordId = data.id;
    	wordLength = data.length;

		for(var i = 0; i < wordLength; i++)
		{
			var hiddenLetter = $('<b></b>', {id: "hiddenLetter" + i, class: "hiddenLetter" } ).text(" _ ");
			hiddenLetter.attr('data-hidden', true);

			$('#hiddenLetters').append(hiddenLetter);
		}

		$('#hiddenLetters').show();

		start_time = new Date().getTime() / 1000;
    });


	for(var i = 0; i < alphapets.length; i++)
	{
		var button = $('<button></button>').text(alphapets[i]);

		button.attr('id','letter' + alphapets[i]);
		button.attr('class','letter');

		button.click((function(btn, letter){
			return function()
			{
				checkLetter(btn, letter);
			}
		})(button, alphapets[i]));

		$('#inputLetters').append(button);
	}

	$( "body" ).keydown(function(e) {
  	var letter = String.fromCharCode(e.keyCode);

  	if (e.keyCode === 221) {
  		letter = 'Å';
  	}
  	if (e.keyCode === 222) {
  		letter = 'Ä';
  	}
  	if (e.keyCode === 192) {
  		letter = 'Ö';
  	}

  	var btn = $("#letter"+letter);

  	if (btn.prop('disabled')) {return;}

  	checkLetter(btn, letter);
	});


	function gameStarted()
	{
		$('#gameFinished').hide();
		$('#hiddenLetters').hide();
    	$('#hiddenLetters').removeClass('hiddenLetter');
	}


	function gameFinished(isVictory)
	{
		$('.letter').attr('disabled', true);

		var newGameBtnText;

		if( isVictory )
		{
			$('#gameFinished').append($('<b></b>').text('Onneksi olkoon, voitit pelin!'));
			$('#gameFinished').append($('<br>'));
			$('#gameFinished').append($('<p></p>').text('Teit yhteensä ' + errorCount + ' virheellistä valintaa.'));
			$('#gameFinished').append($('<p></p>').text('Käytit aikaa ' + getUsedTimeStr(start_time)));
			$('#gameFinished').append($('<br>'));

			newGameBtnText = 'Aloita uusi peli';
		}
		else
		{
			$('#gameFinished').append($('<b></b>').text('Aijai, hävisit pelin!'));
			$('#gameFinished').append($('<br>'));

			newGameBtnText = 'Yritä uudelleen';
		}

		var newGamebutton = $('<button></button>').text(newGameBtnText);

		newGamebutton.click(function(){
			document.location.reload(true);
		});
		
		$('#gameFinished').append(newGamebutton);
		$('#gameFinished').show(1000);
	}

	function getUsedTimeStr(start_time)
	{
		var end_time = new Date().getTime() / 1000;
		var diff = end_time - start_time;

		var seconds = Math.round(diff % 60);
		diff = Math.floor(diff / 60);

		if( diff > 0 )
		{
			var minutes = Math.round(diff % 60);

			return '' + minutes + ' min. ' + seconds + ' s.'
		}

		return '' + seconds + " s."
	}

	function checkLetter(btn, letter)
	{
		$.getJSON({
			        url: serviceRoot + 'letterInWord/' + wordId,
			        data: {'letter':letter}
			    }).then(function(data) 
			    {
			    	var indexes = [];

					$.each( data, function( key, val ) {
						indexes.push(key);
					});

					if( indexes.length > 0 )
					{
						btn.css('color','green');

						for (var i = 0; i < indexes.length; i++) 
						{
							$('#hiddenLetter' + indexes[i]).text(' ' + letter + ' ');
							$('#hiddenLetter' + indexes[i]).attr('data-hidden', false);
						}

						if( $('.hiddenLetter[data-hidden=true]').length == 0 )
						{
							$("#statusImage").attr("src","images/image_vic.png");

							gameFinished(true);
						}
					}
					else
					{
						btn.css('color','red');
						errorCount++;

						$("#statusImage").attr("src","images/image" + errorCount + ".png");

						if( errorCount > maxErrors )
						{
							gameFinished(false);
						}

					}

			    });

		btn.attr('disabled', true);
	}
});
