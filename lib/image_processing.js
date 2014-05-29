var q = require('q');
var tesseract = require('node-tesseract');
var gm = require('gm');

var ocrOptions = {
  l: 'eng',
  psm: 6,
  binary: '/usr/local/bin/tesseract'
};

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
    var angle = dimension.width < dimension.height ? 90 : 0;
    deferred.resolve({result: angle});
  });
  return deferred.promise;
};

exports.rotateImage = function(imagePath, angle){
  var deferred = q.defer();
  gm(imagePath)
  .rotate("white", angle)
  .write(imagePath, function(err, dimension){
    deferred.resolve();
  });
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
