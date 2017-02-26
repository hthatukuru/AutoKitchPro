var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
var bodyParser = require('body-parser');
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

app.post("/playlist", function(request, response)
{
  response.sendFile(__dirname + '/views/playlist.html');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
