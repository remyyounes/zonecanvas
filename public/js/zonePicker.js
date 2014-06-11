;(function(){
  var ZonePicker = ZoneCanvas.Extend(function(params){
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("zoneCanvas pickerCanvas");
    this.zoomFactor = params.zoomFactor || 1;
    this.drag = false;
    this.selectionCoordinates = {};
    this.layoutConstraints = params.layoutConstraints || { width: 400, height: 400 };
    this.setViewZone( params.viewZone || {x: 0, y: 0, width:0, height: 0} );
    this.image = params.image;
    this.zones = {};
    this.navigator = params.navigator || false;
    this.$canvases = $();
    this.init();
  }, ZoneCanvas.prototype);



  ZonePicker.prototype.setImage = function(image){
    this.drawImage(image);
    this.fit();
  };

  ZonePicker.prototype.attachEvents = function(){
    this.attachDrawingEvents();
    this.attachZoomingEvents();
  };

  ZonePicker.prototype.attachZoomingEvents = function(){
    var zonePicker = this;
    zonePicker.$el.on("mousewheel", function(e){
      var zoomRatio = 1.05;
      e.deltaY > 0 ? zonePicker.zoomIn(zoomRatio) :  zonePicker.zoomOut(zoomRatio);
      e.preventDefault();
      e.stopPropagation();
    });
  };

  window.ZonePicker = ZonePicker;
})();
