require("dotenv").config();

var keys = require('./keys');
var fs = require('fs');
var request = require(`request`);
var Spotify = require('node-spotify-api');
var create = process.argv[2];
var control = process.argv[3];
var spotify = new Spotify(keys.spotify);

switch (create) {

  case "spotify-this-song":
    OpenSpotify();
    break;

  case "movie-this":
    OpenOmdb();
    break;

  case "do-what-it-says":
    Random();
    break;
};

function OpenSpotify() {
  if (!control) {
    control = "Better Now";
  }

  spotify.search({ type: "track", query: control, limit: 1 }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    data = JSON.parse(JSON.stringify(data));

    console.log(
      `Artists: ${data.tracks.items[0].album.artists[0].name}`,
      `\nTrack: ${data.tracks.items[0].name}`,
      `\nPreview: ${data.tracks.items[0].preview_url}`,
      `\nAlbum: ${data.tracks.items[0].album.name}`
    );
  });
};

function OpenOmdb() {
  if (!control) {
    control = "The Avengers";
  }

  var omdb = `http://www.omdbapi.com/?t="${control}"&y=&plot=short&apikey=trilogy`;

  request(omdb, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body, null, 2);
      console.log(
        `Title: ${body.Title}`,
        `\nYear: ${body.Year}`,
        `\nIMDB Rating: ${body.imdbRating}`,
        `\n${body.Ratings[1].Source} Rating: ${body.Ratings[1].Value}`,
        `\nCountry Produced: ${body.Country}`,
        `\nLanguage: ${body.Language}`,
        `\nPlot: ${body.Plot}`,
        `\nActors: ${body.Actors}`
      );
    }
  });
}

function Random() {
  fs.readFile("random.txt", "UTF8", function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    data = data.split(",");
    create = data[0];
    control = data[1];

    OpenSpotify();
  });
}