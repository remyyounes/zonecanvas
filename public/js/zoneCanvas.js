;(function(){
  var ZoneCanvas = DocumentCanvas.Extend(function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("zoneCanvas");
    this.zoomFactor = params.zoomFactor || 1;
    this.drag = false;
    this.selectionCoordinates = {};
    this.layoutConstraints = params.layoutConstraints || { width: 400, height: 400 };
    this.viewZone = params.viewZone || {x: 0, y: 0, width:0, height: 0};
    this.image = params.image;
    this.navigator = params.navigator || false;
    this.init();
  },DocumentCanvas.prototype);

  ZoneCanvas.prototype.init = function(){
    this.renderCanvas();
    this.renderDrawingCanvas();
    this.render();
    this.attachEvents();
  };
  ZoneCanvas.prototype.attachEvents = function(){
    this.attachDrawingEvents();
  };
  ZoneCanvas.prototype.renderDrawingCanvas = function(){
    var canvas = $("<canvas class='drawing'></canvas>");
    canvas.attr("width", this.$el.width());
    canvas.attr("height", this.$el.height());
    this.$el.append(canvas);
    this.canvasDrawing = canvas[0];
    this.$canvasDrawing = canvas;
    this.contextDrawing = this.canvasDrawing.getContext("2d");
  };
  ZoneCanvas.prototype.attachDrawingEvents = function(){
    var zoneCanvas = this;
    zoneCanvas.$canvasDrawing.on("mousedown", function(e){
      zoneCanvas.handleMouseDown(e);
    }).on("mouseup", function(e){
      zoneCanvas.handleMouseUp(e);
    }).on("mousemove", function(e){
      zoneCanvas.handleMouseMove(e);
    });
  };

  ZoneCanvas.prototype.handleMouseDown = function(e){
    var zoneCanvas = this;
    e.preventDefault();
    if(!zoneCanvas.image) return;
    zoneCanvas.drag = true;
    zoneCanvas.setMouseSelectionCoordinates( zoneCanvas.getMousePosition(zoneCanvas.canvas, e), true);
  };

  ZoneCanvas.prototype.handleMouseUp = function(e){
    var zoneCanvas = this;
    e.preventDefault();
    if(!zoneCanvas.drag) return;
    zoneCanvas.drag = false;
    zoneCanvas.setMouseSelectionCoordinates( zoneCanvas.getMousePosition(zoneCanvas.canvas, e), false);
    zoneCanvas.drawSelectionBox();
  };

  ZoneCanvas.prototype.handleMouseMove = function(e){
    var zoneCanvas = this;
    e.preventDefault();
    if(!zoneCanvas.drag) return;
    zoneCanvas.setMouseSelectionCoordinates( zoneCanvas.getMousePosition(zoneCanvas.canvas, e), false);
    zoneCanvas.drawSelectionBox();
  };

  ZoneCanvas.prototype.setPreviewZone = function(coordinates){
    //get preview size
    var previewSize = this.getPreviewSize();
    this.selectionCoordinates = {
      x: coordinates.x - previewSize.width / 2,
      y: coordinates.y - previewSize.height / 2,
      width: previewSize.width,
      height: previewSize.height
    };
  };
  ZoneCanvas.prototype.setMouseSelectionCoordinates = function(coordinates, startCoordinates){
    if(startCoordinates){
      this.selectionCoordinates.x = coordinates.x;
      this.selectionCoordinates.y = coordinates.y;
    }else{
      this.selectionCoordinates.width = coordinates.x - this.selectionCoordinates.x;
      this.selectionCoordinates.height = coordinates.y - this.selectionCoordinates.y;
    }
  };
  ZoneCanvas.prototype.setSelectionZone = function(zone){
    // convert true zone to scaled zone
    var zone = this.getLocalCoordinates(zone);
    this.selectionCoordinates = zone;
    this.drawSelectionBox();
  };
  ZoneCanvas.prototype.drawSelectionBox = function() {
    this.clear(this.canvasDrawing);
    this.contextDrawing.strokeRect(
      this.selectionCoordinates.x,
      this.selectionCoordinates.y,
      this.selectionCoordinates.width,
      this.selectionCoordinates.height
    );
    $(this).trigger("zoneselected", this.getStandardCoordinates());
    console.log(this.getStandardCoordinates());
  };
  ZoneCanvas.prototype.selectCorner = function(){
    this.selectionCoordinates.x = this.canvas.width / 2;
    this.selectionCoordinates.y = this.canvas.height / 2;
    this.selectionCoordinates.width = this.canvas.width / 2;
    this.selectionCoordinates.height = this.canvas.height / 2;
    this.drawSelectionBox();
  };

  window.ZoneCanvas = ZoneCanvas;

})();
