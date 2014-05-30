var q = require('q');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var multer  = require('multer');
var exec = require('child_process').exec;
var http = require('http');
var imgProc = require('./lib/image_processing');
var rest = require('restler');


// var imagePath = '/documents/gruid-test-guide.png';
var imagePath = 'public/documents/out.png';
var tmpPath = 'public/tmp/';

var express = require('express'),
  app = express(),
  fs_readFile = q.denodeify(fs.readFile),
  fs_writeFile = q.denodeify(fs.writeFile);

var ocrServer = "192.168.33.42";
var ocrPath = "/external_api/drawing_sets";
// "name=test_drawing" -F "drawing_pdf=@package_bde_elan.pdf"  >



var testDjango = function(pdfPath){
  var deferred = q.defer();
  var options = {
    host: ocrServer,
    path: ocrPath,
    port: 4567,
    method: "GET"
  };

  var req = http.request(options, function(res) {
  });

  req.on('error', function(err) {
    throw err;
  });

  req.end();
  fs.createReadStream(pdfPath).pipe(req);

  return deferred.promise;
}

var djangoOcr = function(pdfPath, documentName){
  var deferred = q.defer();
  var endPoint = "http://" + ocrServer + ":4567" + ocrPath;

  fs.stat(pdfPath, function (err, stats) {

    rest.post( endPoint,{
      multipart: true,
      data: {
        'name': 'test.pdf',
        'drawing_pdf': rest.file(pdfPath, null, stats.size, null, 'application/pdf')
      }
    })
    .on('complete', function(data) {
      console.log('data', data);
      deferred.resolve();
    });

  });


  return deferred.promise;
};


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
    return imgProc.ocr(imagePath);
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

  djangoOcr(pdfPathFull, "test_drawing");
  // testDjango(pdfPathFull);

  exec(cmd, function (error, stdout, stderr) {
    var dir = fs.readdirSync(outputPathFull);
    var pages = [];
    var page = 1;
    var series = function(item, page){
      if(item && item.slice(-4) !== ".png"){
        series(dir.shift(), page);
      } else if(item) {
        var filePath = outputPathFull + item;
        imgProc.getOrientation(filePath).then(function(data){
          var deferred = q.defer();
          var angle = data.result;
          return imgProc.rotateImage(filePath, angle);
        }).then(function(data){
          pages.push({
            documentId: documentId,
            page: page,
            url: outputPathRelative + filenameTemplate + "-" + page + ".png"
          });
          page++;
          series(dir.shift(), page);
        });
      }else{
        console.log("responding with pages:", pages)
        res.json(pages);
      }
    };
    series(dir.shift(), page);
  });
});

app.post('/ocr', function(req, res){
  var documentId = req.body.documentId,
    documentPage = req.body.page,
    zoneName = req.body.zoneName,
    zone = req.body.zone,
    imageBase = [tmpPath, documentId  , "/page-", documentPage].join(''),
    imagePath = [imageBase, ".png"].join(''),
    imagePathOut = [imageBase, ".", zoneName, ".png"].join('');

  imgProc.cropZone(imagePath, imagePathOut, zone).then(function(){
    return imgProc.ocr( __dirname + "/" + imagePathOut );
  }).done(function(result){
    res.json(result);
    console.log("OCR: ", result.result);
  });
});

app.listen(3000);
