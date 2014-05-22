;(function(){

  var Tesseract = function(params){
    this.serverUrl = params.serverUrl;
  };

  Tesseract.prototype = {
    asyncOcr: function(data, callback){
      $.ajax({
        url: this.serverUrl,
        method: "post",
        data: data,
        success: callback
      });
    }
  }
  window.Tesseract = Tesseract;
})();
