var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
var bodyParser = require('body-parser');

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencod

app.get('/', function (req, res, next) {
  try {
    res.sendFile(__dirname + '/views/camService.html');
  } catch (e) {
    next(e)
  }
});

app.post("/picCaptured", function(request, response)
{
  //image present in base64 format
  console.log(request.body);
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
