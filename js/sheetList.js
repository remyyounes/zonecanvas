;(function(){
  var SheetList = function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("sheetList");
    this.sheets = [];
    this.init();
  };

  SheetList.prototype = {
    init: function(){
      this.attachHandlers();
    },
    addSheet: function(params){
      var sheet = $("<li></li>");
      this.sheets.push(new ZoneSheet( {el: sheet, image: params.image}) );
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

      reader.onload = function (){
        sheetList.image = new Image();
        sheetList.image.src = reader.result;
        sheetList.image.onerror = function (e){ alert("Image loading error. " + e); };
        sheetList.image.onload = function(){
          sheetList.addSheet({image: sheetList.image});
        };
      };
      reader.readAsDataURL(file);
    }
  }

  window.SheetList = SheetList;

})();
