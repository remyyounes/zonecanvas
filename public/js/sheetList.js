;(function(){
  var SheetList = function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("sheetList");
    this.ocrEngine = params.ocrEngine;
    this.sheets = [];
    this.init();
  };

  SheetList.prototype = {
    init: function(){
      this.attachHandlers();
    },
    addSheet: function(params){
      var sheet = $("<li></li>");
      this.sheets.push(new ZoneSheet({
        el: sheet,
        image: params.image,
        ocrEngine: this.ocrEngine
      }) );
      this.$el.append(sheet);
    },
    attachHandlers: function(){
      this.attachFilerDropHandler();
    },
    attachFilerDropHandler: function(){
      var sheetList = this;
      document.body.ondragover = function(){ return false };
      document.body.ondragend = function(){ return false };
      document.body.ondrop = function(e){
        e.preventDefault();
        sheetList.load(e.dataTransfer.files[0]);
        return false;
      };
    },
    load: function(file, zoom){
      var sheetList = this;
      zoom = zoom || 1;

      var ext = file.name.split('.').slice(-1)[0];
      var reader = new FileReader();

      if(ext == "png"){
        reader.onload = function (){
          var data = reader.result;
          sheetList.loadPng(data);
        };
        reader.readAsDataURL(file);
      } else if (ext == "pdf"){
        reader.onload = function (){
          var data = reader.result;
          sheetList.loadPdf(data);
        };
        reader.readAsArrayBuffer(file);
      } else console.log("Extension not supported", ext);

    },
    loadPdf: function(data){
      var sheetList = this;
      PDFJS.getDocument(data).then(function getPdf(pdf) {
        sheetList.currentPdf = pdf;
        sheetList.numPages = pdf.numPages;
        sheetList.pageIndex = 1;
        sheetList.loadPdfPage(sheetList.pageIndex);
      });
    },
    loadPdfPage: function (pageIndex, callback) {
      var sheetList = this;
      sheetList.currentPdf.getPage(pageIndex).then(function getPdfPage(page) {
        var callback = function(imageData){
          sheetList.loadPng(imageData);
        }
        var c = document.createElement("CANVAS");
        sheetList.pageToImage(c, page, callback );
      });
    },
    pageToImage: function(canvas, page, callback){
      var sheetList = this;
      var viewport = page.getViewport(1),
      ctx = canvas.getContext('2d');

      // Prepare canvas using PDF page dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvasPrimary context
      page.render({canvasContext: ctx, viewport: viewport}).then(
        function(e){
          var imageData = canvas.toDataURL("image/png");
          if(callback) callback(imageData);
        }
      );
    },
    loadPng: function(data, loaded){
      var sheetList = this;
      sheetList.image = new Image();
      sheetList.image.src = data;
      sheetList.image.onerror = function (e){ alert("Image loading error. " + e); };
      sheetList.image.onload = function(){
        sheetList.addSheet({
          image: sheetList.image,
          ocrEngine: sheetList.ocrEngine
        });
      };
      // loaded && sheetList.image.onload();
    }
  }

  window.SheetList = SheetList;

})();
