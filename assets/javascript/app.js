var _apiKey = 'zEbHjF7VCx7hiK3cOhvxoLmIHwGxy2KB&';
var _topics = ['Pac-Man', 'Donkey Kong', 'Dig Dug', 'Contra', 'Castlevania', 'Street Fighter', 'Grand Theft Auto V', 'Halo', 'Super Mario Bros', 'Blades of Steel',
			'Ico', 'The Legend of Zelda', 'Metroid', 'Call of Duty', 'Duke Nukem', 'Doom', 'Half Life', 'Cup Head', 'Smash Bros.', 'Spy Hunger', 'Gauntlet',
			'Power Stone', 'Mortal Kombat'
			];

// Listener for the Add Entry button
$('#new-entry-btn').on('click', function(event){
	event.preventDefault();

	var newEntryValue = $('#new-entry').val().trim();

	var limitBy = $('#drop-down-menu').text().trim();

	if(isNaN(limitBy)) {
		alert('Invalid limit value specified.');
	} else {
		if(newEntryValue.length === 0) {
			alert('Please specify a value for the new entry');
		} else {
			_topics.push(newEntryValue);

			renderButtons(limitBy);
		}
	}
});

// Listener for the selected limit value dropdown button
$(document).on('click', '.limit-by-value', populateLimitBy);

// Listener for entry buttons
$(document).on('click', '.entry-button', displayGIFs);

// Listener to animate or displaying still image
$(document).on('click', '.image-container .col-md-4', changeImage);

// Listener to show the play button
$(document).on('mouseenter', '.image-container .col-md-4', showPlayOrPause);

// Listener to show the pause button
$(document).on('mouseleave', '.image-container .col-md-4', showPlayOrPause);

// Function to display the play or the pause button depending on the current state of the image
function showPlayOrPause(event) {
	// Get image state
	// This will be used to determine which button to display
	var imageState = $(this).children('.entry-gif').attr('img-state');

	if(imageState === 'still') {
		$(this).children('.play-pause-btn').attr('src', './assets/images/play-button.png');
	}
	else if(imageState === 'animated') {
		$(this).children('.play-pause-btn').attr('src', './assets/images/pause-button.png');
	} else {
		alert('Unhandled image state encountered in showPlayOrPause():  ' + imageState);
	}

	if(event.type === 'mouseenter') {
		$(this).children('.play-pause-btn').css('display', 'inline');
	} else if(event.type === 'mouseleave') {
		$(this).children('.play-pause-btn').css('display', 'none');
	} else {
		alert('Unhandled event.type encountered in showPlayOrPause():  ' + event.type);
	}
}

// Function used to change the text on the Select Limit By button
function populateLimitBy() {
	$('#drop-down-menu').html($(this).text() + '  <span class="caret"></span>');
}

// Creates buttons for each entry in the topics array
function renderButtons(limitByValue) {
	$('#buttons').empty();

	for(var i=0; i<_topics.length; i++) {
		var button = $('<button></button>');

		button.text(_topics[i]);
		button.addClass('entry-button');
		button.addClass('btn btn-success btn-md');
		button.attr('limit-by', limitByValue);

		$('#buttons').append(button);
	}
}

// Pulls data from the Giphy API and displays it
function displayGIFs() {
	var entryValue = $(this).text();

	$('#images').empty();

	var limitBy = $(this).attr('limit-by');

	// Update results limited by span
	$('#results-limited-by').text(limitBy);
	
	var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + _apiKey + '&q=' + entryValue + '&limit=' + limitBy;

	$.ajax({
		url: queryURL,
		method: "GET",
	}).done(function(response) {
		var newRowCounter = 0;
		var lastRowId = 0;

		for(var i=0; i<response.data.length; i++) {
			var stillImageURL = response.data[i].images.downsized_still.url;
			var animatedURL = response.data[i].images.downsized.url;
			var imageAlt = response.data[i].slug;

			var rating = response.data[i].rating;

			var rowDiv;

			// Display 3 images per row
			if(newRowCounter % 3 === 0) {
				// Create a new row
				rowDiv = $('<div></div>');
				
				rowDiv.addClass('image-container');
				rowDiv.addClass('row');
				rowDiv.attr('id', newRowCounter);

				lastRowId = newRowCounter;
			} else {
				// Append to existing row
				rowDiv = $('#' + lastRowId);
			}

			var colDiv = $('<div></div>');
			colDiv.addClass('col-md-4');

			var image = $('<img/>');
			image.addClass('entry-gif img-responsive');
			image.attr('src', stillImageURL);
			image.attr('alt', imageAlt);
			
			image.attr('img-state', 'still');
			image.attr('animated-url', animatedURL);
			image.attr('still-url', stillImageURL);

			// Add a play and pause image
			var playOrPause = $('<img/>');
			playOrPause.attr('src', './assets/images/play-button.png');
			playOrPause.addClass('play-pause-btn img-responsive');

			colDiv.append(image);
			colDiv.append(playOrPause);
			colDiv.append('Rating:  ' + rating + '<br>');

			rowDiv.append(colDiv);

			$('#images').append(rowDiv);

			newRowCounter++;
		}
	});
}

// Changes from still image to the animated image based on the state
function changeImage() {
	var imgState = $(this).children('.entry-gif').attr('img-state');
	var stillURL = $(this).children('.entry-gif').attr('still-url');
	var animatedURL = $(this).children('.entry-gif').attr('animated-url');

	if(imgState === 'still') {
		$(this).children('.play-pause-btn').attr('src', './assets/images/pause-button.png');

		$(this).children('.entry-gif').attr('src', animatedURL);

		$(this).children('.entry-gif').attr('img-state', 'animated');
	} else if(imgState === 'animated') {
		$(this).children('.play-pause-btn').attr('src', './assets/images/play-button.png');

		$(this).children('.entry-gif').attr('src', stillURL);

		$(this).children('.entry-gif').attr('img-state', 'still');
	} else {
		alert("Unhandled image state encountered in changeImage(). " + imgState);
	}
}

