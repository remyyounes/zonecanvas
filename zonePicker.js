;(function(){
  var ZonePicker = function(params){
    this.zoomFactor = params.zoomFactor || 1;
    this.el = params.el[0];
    this.$el = params.el;
    this.layoutConstraints = params.layoutConstraints;
    this.init();
  };

  ZonePicker.prototype = {
    init: function(){
      this.renderViewPort();
      this.attachHandlers();
    },
    renderViewPort: function(){
      var viewport = $("<div id='pickerCanvas'></div>");
      this.$el.append(viewport);
      this.viewport = new ZoneCanvas({
        el: viewport,
        layoutConstraints: this.layoutConstraints
      });
    },
    setImage: function(image){
      this.image = image;
      this.viewport.drawImage(this.image);
      this.viewport.fit();
    },
    zoomZone: function(zone){
      this.viewport.zoomZone(zone);
    },
    attachHandlers: function(){
      var zonePicker = this;
      $(this.viewport).on("zoneselected", function(e, data){
        $(zonePicker).trigger("zoneselected", [data]);
      });
    },
  };

  window.ZonePicker = ZonePicker;
})();
