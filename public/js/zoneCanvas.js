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
    this.$canvases = $();
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
    this.attachZoomingEvents();
  };
  ZoneCanvas.prototype.renderDrawingCanvas = function(){
    var canvas = $("<canvas class='drawing transparent'></canvas>");
    canvas.attr("width", this.$el.width());
    canvas.attr("height", this.$el.height());
    this.$el.append(canvas);
    this.canvasDrawing = canvas[0];
    this.$canvasDrawing = canvas;
    this.contextDrawing = this.canvasDrawing.getContext("2d");
    this.$canvases = this.$canvases.add(this.$canvasDrawing);
  };
  ZoneCanvas.prototype.attachZoomingEvents = function(){
    var zoneCanvas = this;
    zoneCanvas.$el.on("mousewheel", function(e){
      e.deltaY > 0 ? zoneCanvas.zoomIn(1.2) :  zoneCanvas.zoomOut(1.2);
      e.preventDefault();
      e.stopPropagation();
      console.log("slow");
    });
  },
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

  ZoneCanvas.prototype.setPreviewZone = function(location){
    //get preview size
    var previewSize = this.getPreviewSize();
    this.selectionCoordinates = {
      x: location.x - previewSize.width / 2,
      y: location.y - previewSize.height / 2,
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
  ZoneCanvas.prototype.setSelectionZone = function(zone, silent){
    // convert true zone to scaled zone
    var zone = this.getLocalCoordinates(zone);
    this.selectionCoordinates = zone;
    this.drawSelectionBox(silent);
  };
  ZoneCanvas.prototype.drawBox = function(context, zone, color){
    context.strokeStyle = color || "blue";
    context.strokeRect(
      zone.x,
      zone.y,
      zone.width,
      zone.height
    );
    context.strokeStyle = "black";
  }
  ZoneCanvas.prototype.drawSelectionBox = function(silent) {
    this.clear(this.canvasDrawing);
    this.drawBox(this.contextDrawing, this.selectionCoordinates, "red");
    !silent && $(this).trigger("zoneselected", this.getStandardCoordinates());
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
