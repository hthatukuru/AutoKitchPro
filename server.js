var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
var bodyParser = require('body-parser');

/* const cognitiveServices = require('cognitive-services');

const emotion = new cognitiveServices.emotion({
    'API_KEY': '75e5ee1d26c1405eba04783b5abe5f3b'
});

emotion.emotionRecognition()
    .then((response) => {
        console.log('Got response', response);
    })
    .catch((err) => {
        console.error('Encountered error making request:', err);
    });
*/
app.use(logger('dev'))
app.use("/static" ,express.static(__dirname + '/static'))

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

app.get('/', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/views/home.html');
  } catch (e) {
    next(e)
  }
});

app.post("/picCaptured", function(request, response)
{
  //image present in base64 format
  console.log(request.body.img);
  var base64Data = request.body.img.replace(/^data:image\/jpeg;base64,/, "");

  require("fs").writeFile("tempImg.jpeg", base64Data, 'base64', function(err) {
    console.log(err);
  });
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
