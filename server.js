var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')

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

app.get('/', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/views/home.html');
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
