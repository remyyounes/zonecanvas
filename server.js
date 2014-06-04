var q = require('q');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var multer  = require('multer');
var imgProc = require('./lib/image_processing');
var classifier = require('./lib/classifier');




// var imagePath = '/documents/gruid-test-guide.png';
var imagePath = 'public/documents/out.png';
var tmpPath = 'public/tmp/';

var express = require('express'),
  app = express(),
  fs_readFile = q.denodeify(fs.readFile),
  fs_writeFile = q.denodeify(fs.writeFile);

// "name=test_drawing" -F "drawing_pdf=@package_bde_elan.pdf"  >


app.use(bodyParser());
app.use(multer({ dest: './public/uploads'}))
app.use(express.static(__dirname + '/public'));

app.post('/ocrdata', function(req, res){
  var imageData = req.body.image_data,
    base64Data = imageData.replace(/^data:image\/png;base64,/,""),
    binaryData = new Buffer(base64Data, 'base64').toString('binary'),
    imagePath = "out.png";

  fs_writeFile( imagePath, binaryData, "binary").then(function(data) {
    return imgProc.ocr(imagePath);
  }).done(function(result){
    res.json(result);
  });
});

app.post('/pdf', function(req, res){

  var documentId = 3;
  var file = req.files.file;
  var pdfPathRelative = file.path;
  var outputPathRelative = path.join('tmp');
  var pdfPathFull = path.join(__dirname, pdfPathRelative);
  var pngPathOutput = path.join(__dirname, 'public', outputPathRelative);

  // classifier.djangoOcr(pdfPathFull, "test_drawing");

  imgProc.pdfToPng(pdfPathFull, pngPathOutput, documentId).then(function(pages){
    console.log("responding with pages:", pages);
    res.json(pages);
  });

});

app.post('/ocr', function(req, res){
  var documentId = req.body.documentId,
    documentPage = req.body.page,
    zoneName = req.body.zoneName,
    zone = req.body.zone,
    zonePct = req.body.zonePct,
    imageBase = [tmpPath, documentId  , "/page-", documentPage].join(''),
    imagePath = [imageBase, ".png"].join(''),
    imagePathOut = [imageBase, ".", zoneName, ".png"].join('');
  imgProc.getZoneFromPct(imagePath, zonePct)
  .then(function(data){
    return imgProc.cropZone(imagePath, imagePathOut, data.zone);
  })
  .then(function(){
    return imgProc.ocr( __dirname + "/" + imagePathOut );
  })
  .done(function(result){
    res.json(result);
    console.log("OCR: ", result.result);
  });
});

app.listen(3000);
