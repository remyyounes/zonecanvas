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
      this.render();
      this.attachHandlers();
    },
    render: function(){
      this.addForm = $('<form enctype="multipart/form-data">'
        +'  <input name="file" type="file" />'
        +'  <input type="button" value="Upload" />'
        +'</form>');
      this.$el.append(this.addForm);
    },
    addSheet: function(params){
      var sheet = $("<li></li>");
      this.sheets.push(new ZoneSheet({
        el: sheet,
        image: params.image,
        ocrEngine: this.ocrEngine,
        documentId: params.documentId,
        page: params.page
      }) );
      this.$el.append(sheet);
    },
    attachHandlers: function(){
      this.attachFilerDropHandler();
      this.attachFormHandler();
    },
    attachFormHandler: function(){
      var sheetList = this;
      $(':file').change(function(e){
        var file = this.files[0];
        var name = file.name;
        var size = file.size;
        var type = file.type;
        var formData = new FormData(sheetList.addForm[0]);
        $.ajax({
          url: '/pdf',
          type: 'POST',
          data: formData,
          cache: false,
          contentType: false,
          processData: false
        }).then(
          function(data){
            for(var i = 0; i<data.length; i++){
              var sheet = data[i];
              sheetList.loadPng(sheet.url, {
                documentId: sheet.documentId,
                page: sheet.page,
                ocrEngine: this.ocrEngine
              })
              console.log("adding sheet", sheet.url);
            }
          }
        );
      });
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
          // sheetList.loadPdf(data);
          sheetList.savePdf(data);
        };
        reader.readAsArrayBuffer(file);
      } else console.log("Extension not supported", ext);
    },
    savePdf: function(data){

    },
    // loadPdf: function(data){
    //   var sheetList = this;
    //   PDFJS.getDocument(data).then(function getPdf(pdf) {
    //     sheetList.currentPdf = pdf;
    //     sheetList.numPages = pdf.numPages;
    //     sheetList.pageIndex = 1;
    //     sheetList.loadPdfPage(sheetList.pageIndex);
    //   });
    // },
    // loadPdfPage: function (pageIndex, callback) {
    //   var sheetList = this;
    //   sheetList.currentPdf.getPage(pageIndex).then(function getPdfPage(page) {
    //     var callback = function(imageData){
    //       sheetList.loadPng(imageData);
    //     }
    //     var c = document.createElement("CANVAS");
    //     sheetList.pageToImage(c, page, callback );
    //   });
    // },
    // pageToImage: function(canvas, page, callback){
    //   var sheetList = this;
    //   var viewport = page.getViewport(1),
    //   ctx = canvas.getContext('2d');
    //
    //   // Prepare canvas using PDF page dimensions
    //   canvas.height = viewport.height;
    //   canvas.width = viewport.width;
    //
    //   // Render PDF page into canvasPrimary context
    //   page.render({canvasContext: ctx, viewport: viewport}).then(
    //     function(e){
    //       var imageData = canvas.toDataURL("image/png");
    //       if(callback) callback(imageData);
    //     }
    //   );
    // },
    loadPng: function(data, params){
      var sheetList = this;
      var png = new Image();
      png.src = data;
      png.onerror = function (e){ alert("Image loading error. " + e); };
      png.onload = function(){
        sheetList.addSheet({
          image: png,
          ocrEngine: sheetList.ocrEngine,
          page: params.page,
          documentId: params.documentId
        });
      };
    }
  }

  window.SheetList = SheetList;

})();
