;(function(){
  var ZonePicker = function(params){
    this.zoomFactor = params.zoomFactor || 1;
    this.el = params.el[0];
    this.$el = params.el;
    this.init();
  };

  ZonePicker.prototype = {
    init: function(){
      this.renderViewPort();
    },
    renderViewPort: function(){
      var viewport = $("<div id='pickerCanvas'></div>");
      this.$el.append(viewport);
      this.viewport = new ZoneCanvas({ el: viewport });
    },
    setImage: function(image){
      this.image = image;
      this.viewport.drawImage(this.image);
    },
    zoomZone: function(zone){
      this.viewport.zoomZone(zone);
    }
  };

  window.ZonePicker = ZonePicker;
})();
