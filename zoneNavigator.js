;(function(){
  var ZoneNavigator = function(params){
    this.zoomFactor = params.zoomFactor || 1;
    this.el = params.el[0];
    this.$el = params.el;
    this.init();
  };

  ZoneNavigator.prototype = {
    init: function(){
      this.renderPreview();
      this.attachHandlers();
    },
    renderPreview: function(){
      var preview = $("<canvas></canvas>");
      this.$el.append(preview);
      this.preview = new ZoneCanvas({
        canvas: preview
      });
    },
    attachHandlers: function(){
      $(this.preview).on("zoneselected", function(e, data){
        debugger;
        $(this).trigger("zoneselected", data);
      })
    },
    setImage: function(image){
      this.image = image;
      this.preview.drawImage(this.image);
      this.preview.fit();
    }
  };

  window.ZoneNavigator = ZoneNavigator;
})();
