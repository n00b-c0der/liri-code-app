require("dotenv").config();
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotifySearch = new Spotify(keys.spotify);
var omdbKey = keys.omdb.api_key;

// node liri.js [ command ] [ query - optional ]
var command = process.argv[2];
var query = process.argv[3];

var spotifyThisSong = function(trackQuery) {
	// Load Spotify npm package
	

	// if no trackQuery is passed in, then we will be querying for this particular song
	if(trackQuery === undefined) {
		trackQuery = "the sign ace of base";
	}
		
	// Spotify API request (if an object is returned, output the first search result's artist(s), song, preview link, and album)
	// spotify.search({ type: 'track', query: trackQuery }, function(error, data) {
		spotifySearch.search({ type: 'track', query: trackQuery }, function(err, data) {
	    if(err) { // if error
	        console.log('Error occurred: ' + err);
	    } else { // if no error
	    	// For loop is for when a track has multiple artists
				for(var i = 0; i < data.tracks.items[0].artists.length; i++) {
					if(i === 0) {
						console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
					} else {
						console.log("              " + data.tracks.items[0].artists[i].name);
					}
				}
				console.log("Song:         " + data.tracks.items[0].name);
				console.log("Preview Link: " + data.tracks.items[0].preview_url);
				console.log("Album:        " + data.tracks.items[0].album.name);
				// console.log(data);
	    }
	 
	 		
	});
}

var movieThis = function(movieQuery) {
	// Load request npm module
	var request = require("request");

	// if query that is passed in is undefined, Mr. Nobody becomes the default
	if(movieQuery === undefined) {
		movieQuery = "mr nobody";
	}

	var omdbURL = 'http://www.omdbapi.com/?t=' + movieQuery + '&apikey=' + omdbKey + '&plot=short&tomatoes=true';

	// HTTP GET request
	request(omdbURL, function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	    console.log("* Title of the movie:         " + JSON.parse(body).Title);
	    console.log("* Year the movie came out:    " + JSON.parse(body).Year);
	    console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
	    console.log("* Country produced:           " + JSON.parse(body).Country);
	    console.log("* Language of the movie:      " + JSON.parse(body).Language);
	    console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
			console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

	    // For loop parses through Ratings object to see if there is a RT rating
	    // 	--> and if there is, it will print it
	    for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
	    	if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	    		console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
	    		if(JSON.parse(body).Ratings[i].Website !== undefined) {
	    			console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
	    		}
	    	}
	    }
	  }
	});
}

var concertThis = function(concertQuery) {
	
	var request = require("request");

	if(concertQuery === undefined) {
		concertQuery = "OutKast";
	}

	// HTTP GET request
	request("https://rest.bandsintown.com/artists/" + concertQuery + "/events?app_id=codingbootcamp", function(err, datetime, venue) {
		console.log(datetime);
		console.log(venue);
	});
}

// App functionality due to user input
if(command === "spotify-this-song") {
	spotifyThisSong(query);
} else if(command === "movie-this") {
	movieThis(query);
} else if(command === "concert-this") {
	concertThis(query);
} else if(command === "do-what-it-says") {
	// App functionality from file read / loads fs npm package
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;

		// If there is a comma, then we will split the string from file in order to differentiate between the command and query
		// 	--> if there is no comma, then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		// After reading the command from the file, decides which app function to run
		if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else if (command === "concert-this") {
			concertThis(query);
		} else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if(command === undefined) { // use case where no command is given
	console.log("Please enter a command to run LIRI.")
} else { // use case where command is given but not recognized
	console.log("Command not recognized! Please try again.")
}