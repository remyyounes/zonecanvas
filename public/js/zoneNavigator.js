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
    this.zones = {};
    this.navigator = params.navigator || false;
    this.$canvases = $();
    this.init();
  }, ZoneCanvas.prototype);

  ZoneNavigator.prototype.init = function(){
    this.renderCanvas();
    this.renderDrawingCanvas();
    this.renderZoneListCanvas();
    this.render();
    this.attachEvents();
  };

  ZoneNavigator.prototype.renderZoneListCanvas = function(){
    var canvasZoneList = $("<canvas class='zonelist transparent'></canvas>");
    canvasZoneList.attr("width", this.$el.width());
    canvasZoneList.attr("height", this.$el.height());
    this.$el.append(canvasZoneList);
    this.canvasZoneList = canvasZoneList[0];
    this.$canvasZoneList = canvasZoneList;
    this.contextZoneList = this.canvasZoneList.getContext("2d");
    this.$canvases = this.$canvases.add(this.$canvasZoneList);
  };

  ZoneNavigator.prototype.renderZoneList = function(){
    this.clear(this.canvasZoneList);
    for(var i in this.zones){
      var z = this.zones[i];
      this.drawBox( this.contextZoneList, z);
    }
  };

  ZoneNavigator.prototype.addZone = function(name, zone){
    this.zones[name] = this.getLocalCoordinates(zone);
    this.renderZoneList();
  };

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

  ZoneNavigator.prototype.setPreviewZone = function(location){
    var pSize = this.getPreviewSize();
    this.selectionCoordinates = {
      x: location.x - pSize.width / 2,
      y: location.y - pSize.height / 2,
      width: pSize.width,
      height: pSize.height
    };
  };

  DocumentCanvas.prototype.setPreviewSize = function(zone){
    var localDimensions = this.getLocalCoordinates(zone);
    this.previewSize = {
      width: localDimensions.width,
      height: localDimensions.height
    };
  };

  DocumentCanvas.prototype.getPreviewSize = function(){
    this.previewSize = this.previewSize || this.getLocalCoordinates(this.viewZone);
    return this.previewSize;
  };

  window.ZoneNavigator = ZoneNavigator;
})();
