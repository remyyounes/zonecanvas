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
      var preview = $("<div id='navigatorCanvas'></div>");
      this.$el.append(preview);
      this.preview = new ZoneCanvas({ el: preview });
    },
    attachHandlers: function(){
      var zoneNavigator = this;
      $(this.preview).on("zoneselected", function(e, data){
        $(zoneNavigator).trigger("zoneselected", [data]);
      });
    },
    setImage: function(image){
      this.image = image;
      this.preview.drawImage(this.image);
      this.preview.fit();
    }
  };

  window.ZoneNavigator = ZoneNavigator;
})();
