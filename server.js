var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var azure = require('azure-storage');
var blobSvc = azure.createBlobService("moodifystorage", "O3fGo+G5qi5P0oakUgRddnMK2qqmyiTePu396fTbvIpJ5fykG6xZtMLoWrZJQh6bsVJ/BExmB9JhAJhmHjf/mQ==");

blobSvc.createContainerIfNotExists('jarviscontainer', function(error, result, response){
    if(!error){
      // Container exists and is private
    }
});

blobSvc.setContainerAcl('jarviscontainer', null /* signedIdentifiers */, {publicAccessLevel : 'container'} /* publicAccessLevel*/, function(error, result, response){
  if(!error){
    // Container access level set to 'container'
  }
});

var client_id = '0497294666314553b3013b85d6abc9a4'; // Your client id
var client_secret = '4e639576b40847e6b5a84d4418090bed'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri

app.use(logger('dev'));
app.use("/static" ,express.static(__dirname + '/static'));
app.use(cookieParser());

app.get('/', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/views/home.html');
  } catch (e) {
    next(e)
  }
});

app.get('/spotify-web-api.js', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/static/js/spotify-web-api.js');
  } catch (e) {
    next(e)
  }
});

// app.get('/static/css/homeCSS.css', function (req, res, next){
//   res.sendFile("static/css/homeCSS.css");
// }

//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencod

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.get('/camService', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/views/camService.html');
  } catch (e) {
    next(e)
  }
});


app.post("/picCaptured", function(request, response)
{
console.log("hello world");
var rawdata = request.body.img;
var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
var type = matches[1];
var buffer = new Buffer(matches[2], 'base64');

blobSvc.createBlockBlobFromText('jarviscontainer','tempImg.jpg', buffer, {contentType:type}, function(error, result, response) {
        if (error) {
            console.log("screwed", error);
        }else{
         console.log("happy", result)
        }
    });
    console.log("Reached ajax");

    // $.ajax({
    //     url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?",
    //     beforeSend: function(xhrObj){
    //         // Request headers
    //         xhrObj.setRequestHeader("Content-Type","application/json");
    //         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","75e5ee1d26c1405eba04783b5abe5f3b");
    //     },
    //     type: "POST",
    //     // Request body , https://portalstoragewuprod.azureedge.net/emotion/recognition1.jpg
    //     data: '{ "Url": "https://portalstoragewuprod.azureedge.net/emotion/recognition1.jpg" }'
    // })
    // .done(function(data) {
    //     alert("success");
    //     if (data.length > 0) {
    //       alert(data[1].scores.happiness);
    //     }
    //     else {
    //         alert("No faces detected.");
    //     }
    // })
    // .fail(function() {
    //     console.log("Something messed up");
    //     alert("error");
    // });
});
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-top-read playlist-read-private playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.post("/playlist", function(request, response)
{
  response.sendFile(__dirname + '/views/playlist.html');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
