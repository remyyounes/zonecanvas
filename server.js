var q = require('q');
var bodyParser = require('body-parser');
var tesseract = require('node-tesseract');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var multer  = require('multer');
var exec = require('child_process').exec;

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

app.use(bodyParser({
  // keepExtensions:true,
  // uploadDir:path.join(__dirname,'/public/tmp')
}));
app.use(multer({ dest: './public/uploads'}))
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
  });
});

app.post('/pdf', function(req, res){
  var documentId = 2
  var file = req.files.file;
  var pdfPathRelative = file.path;
  var outputPathRelative = path.join('tmp/', documentId.toString(), '/');
  var pdfPathFull = path.join(__dirname, pdfPathRelative);
  var outputPathFull = path.join(__dirname, '/public/', outputPathRelative);
  !fs.existsSync(outputPathFull) && fs.mkdirSync(outputPathFull);
  var filenameTemplate = "page";
  var cmd = 'pdftocairo -png -r 300 ' + pdfPathFull + " "+ outputPathFull + filenameTemplate;
  exec(cmd, function (error, stdout, stderr) {
      var dir = fs.readdirSync(outputPathFull);
      var pages = [];
      var page = 1;
      for (var i in dir) {
        var p = dir[i];
        pages.push({
          documentId: documentId,
          page: page,
          url: outputPathRelative + filenameTemplate + "-" + page + ".png"
        });
        page++;
      }
      res.json(pages);
  });
});

app.post('/ocr', function(req, res){
  console.log("OCR Request");
  var documentId = req.body.documentId;
  var documentPage = req.body.page;
  var zoneName = req.body.zoneName;
  var zone = req.body.zone;

  var imageUrl = [tmpPath, documentId  , "/page-", documentPage].join('');
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
