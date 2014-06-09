var q = require('q');
var tesseract = require('node-tesseract');
var gm = require('gm');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

var ocrOptions = {
  l: 'eng',
  psm: 6,
  binary: '/usr/local/bin/tesseract'
};

var imgProc = this;

exports.ocr = function(imagePath){
  var deferred = q.defer();
  tesseract.process(imagePath, ocrOptions, function(err, text) {
    if(err) {
      console.log(err);
      deferred.resolve({error: err});
    } else {
      deferred.resolve({result: text});
    }
  });
  return deferred.promise;
};

exports.getOrientation = function(imagePath){
  var deferred = q.defer();
  gm(imagePath)
  .size(function(err, dimension){
    if(err)console.log("err>>", err);
    var angle = dimension.width < dimension.height ? 90 : 0;
    deferred.resolve({result: angle});
  });
  return deferred.promise;
};

exports.getZoneFromPct = function(imagePath, zonePct){
  var deferred = q.defer();
  gm(imagePath)
  .size(function(err, dimension){
    if(err)console.log("err>>", err);
    var zone = {
      x: zonePct.x * dimension.width,
      y: zonePct.y * dimension.height,
      width: zonePct.width * dimension.width,
      height: zonePct.height * dimension.height
    };
    deferred.resolve({zone: zone, err: err});
  });
  return deferred.promise;
};


exports.rotateImage = function(imagePath, angle){
  var deferred = q.defer();
  if(angle){
    gm(imagePath)
    .rotate("white", angle)
    .write(imagePath, function(err, dimension){
      deferred.resolve();
    });
  }else{
    deferred.resolve();
  }
  return deferred.promise;
};

exports.cropZone = function(imagePath, imagePathOut, zone){
  var deferred = q.defer();
  gm(imagePath)
  .crop(zone.width, zone.height, zone.x, zone.y)
  .write( imagePathOut, function (err){
    if(err) console.log(err);
    deferred.resolve();
  });
  return deferred.promise;
};


exports.scaleDown = function(imagePath, imagePathOut){
  var deferred = q.defer();
  gm(imagePath)
  .resize(800,800)
  .write( imagePathOut, function (err){
    if(err) console.log(err);
    deferred.resolve();
  });
  return deferred.promise;
};


exports.pdfToPng = function(pdfPath, pngPath, documentId){

  var deferred = q.defer(),
    outputDir = path.join(pngPath, documentId.toString()),
    outputDirSmall = path.join(pngPath, documentId.toString(), 'small'),
    outputFile = path.join(outputDir, "page"),
    cmd = 'pdftocairo -png -r 300 ' + pdfPath + ' ' + outputFile,
    pages = [],
    page = 1;

  createDirectory(outputDir);
  createDirectory(outputDirSmall);

  exec(cmd, function (error, stdout, stderr) {
    var dir = fs.readdirSync(outputDir);
    var series = function(item, page){
      if(item && path.extname(item) !== ".png"){
        series(dir.shift(), page);
      } else if(item) {
        var itemPath = path.join(outputDir, item);
        var itemPathSmall = path.join(outputDirSmall, item);
        imgProc.getOrientation(itemPath)
        .then(function(data){
          var angle = data.result;
          return imgProc.rotateImage(itemPath, angle);
        })
        .then(function(){
          return imgProc.scaleDown(itemPath, itemPathSmall);
        })
        .then(function(){
          pages.push({
            documentId: documentId,
            page: page,
            url: path.join("tmp/", documentId.toString(), 'small', item)
            // url: path.join("tmp/", documentId.toString(), item)
          });
          page++;
          series(dir.shift(), page);
        });
      }else{
        deferred.resolve(pages);
      }
    };
    series(dir.shift(), page);
  });
  return deferred.promise;
};


// creates an empty dir, or just empties it
var createDirectory = function(dirPath){
  rimraf.sync(dirPath);
  fs.mkdirSync(dirPath);
};
