var q = require('q');
var rest = require('restler');
var ocrServer = "192.168.33.42";
var ocrPath = "/external_api/drawing_sets";

exports.djangoOcr = function(pdfPath, documentName){
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
      // read data and get the
      deferred.resolve();
    });

  });


  return deferred.promise;
};
