;(function(){
  var ZoneNavigator = ZoneCanvas.Extend(function(params){
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("zoneCanvas");
    this.zoomFactor = params.zoomFactor || 1;
    this.drag = false;
    this.selectionCoordinates = {};
    this.layoutConstraints = params.layoutConstraints || { width: 400, height: 400 };
    this.setViewZone( params.viewZone || {x: 0, y: 0, width:0, height: 0} );
    this.image = params.image;
    this.navigator = params.navigator || false;
    this.init();
  }, ZoneCanvas.prototype);

  ZoneNavigator.prototype.setImage = function(image){
    this.drawImage(image);
    this.fit();
  };

  ZoneNavigator.prototype.handleMouseDown = function(e){
    var zoneNavigator = this;
    e.preventDefault();
    if(!zoneNavigator.image) return;
    zoneNavigator.drag = true;
    zoneNavigator.setPreviewZone( zoneNavigator.getMousePosition(zoneNavigator.canvas, e), true);
    zoneNavigator.drawSelectionBox();
  };

  ZoneNavigator.prototype.handleMouseUp = function(e){
    var zoneNavigator = this;
    e.preventDefault();
    if(!zoneNavigator.drag) return;
    zoneNavigator.drag = false;
    zoneNavigator.setPreviewZone( zoneNavigator.getMousePosition(zoneNavigator.canvas, e), false);
    zoneNavigator.drawSelectionBox();
  };

  ZoneNavigator.prototype.handleMouseMove = function(e){
    var zoneNavigator = this;
    e.preventDefault();
    if(!zoneNavigator.drag) return;
    zoneNavigator.setPreviewZone( zoneNavigator.getMousePosition(zoneNavigator.canvas, e), false);
    zoneNavigator.drawSelectionBox();
  };


  window.ZoneNavigator = ZoneNavigator;
})();
