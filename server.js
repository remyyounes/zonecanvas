var q = require('q');
var bodyParser = require('body-parser');
var tesseract = require('node-tesseract');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

// var imageUrl = '/documents/gruid-test-guide.png';
var imageUrl = 'public/documents/out.png';
var tmpPath = 'public/tmp/';
var ocrOptions = {
    l: 'eng',
    psm: 6,
    binary: '/usr/local/bin/tesseract'
};


var ocr = function(imagePath){
  var deferred = q.defer();
  tesseract.process(__dirname + "/" + imagePath, ocrOptions, function(err, text) {
    debugger;
      if(err) {
          deferred.resolve({error: err});
      } else {
          deferred.resolve({result: text});
      }
  });
  return deferred.promise;
}


var express = require('express'),
  app = express(),
  fs_readFile = q.denodeify(fs.readFile),
  fs_writeFile = q.denodeify(fs.writeFile);

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.post('/ocrdata', function(req, res){
  var imageData = req.body.image_data,
    base64Data = imageData.replace(/^data:image\/png;base64,/,""),
    binaryData = new Buffer(base64Data, 'base64').toString('binary'),
    imagePath = "out.png";

  fs_writeFile( imagePath, binaryData, "binary").then(function(data) {
    return ocr(imagePath);
  }).done(function(result){
    res.json(result);
  })
});

app.post('/ocr', function(req, res){
  var imageId = req.body.id;
  var imagePage = req.body.page;
  var zoneName = req.body.zoneName;
  var zone = req.body.zone;

  var imageUrl = [tmpPath, imageId  , "/page-", imagePage].join('');
  var imageOutUrl = [imageUrl, ".", zoneName, ".png"].join('');
  console.log(imageOutUrl);
  gm(imageUrl+".png")
  .crop(zone.width, zone.height, zone.x, zone.y)
  .write( imageOutUrl, function (err) {
    if (!err){
      ocr(imageOutUrl).done(function(result){
        res.json(result);
      })
    };
  });
});

app.listen(3000);
