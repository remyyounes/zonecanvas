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

  // var ZonePicker = function(params){
  //   this.zoomFactor = params.zoomFactor || 1;
  //   this.el = params.el[0];
  //   this.$el = params.el;
  //   this.layoutConstraints = params.layoutConstraints;
  //   this.init();''
  // };
  //
  // ZonePicker.prototype = {
  //   init: function(){
  //     this.renderViewPort();
  //     this.attachHandlers();
  //   },
  //   renderViewPort: function(){
  //     var viewport = $("<div id='pickerCanvas'></div>");
  //     this.$el.append(viewport);
  //     this.viewport = new ZoneCanvas({
  //       el: viewport,
  //       layoutConstraints: this.layoutConstraints
  //     });
  //   },
  //   setImage: function(image){
  //     this.image = image;
  //     this.viewport.drawImage(this.image);
  //     this.viewport.fit();
  //   },
  //   showZone: function(zone){
  //     this.viewport.showZone(zone);
  //   },
  //   attachHandlers: function(){
  //     var zonePicker = this;
  //     $(this.viewport).on("zoneselected", function(e, data){
  //       $(zonePicker).trigger("zoneselected", [data]);
  //     });
  //   },
  // };

  window.ZonePicker = ZonePicker;
})();
