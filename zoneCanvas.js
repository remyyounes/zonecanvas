;(function(){
  var ZoneCanvas = function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("zoneCanvas");
    this.zoomFactor = params.zoomFactor || 1;
    this.drag = false;
    this.selectionCoordinates = {};
    this.viewZone = {x: 0, y: 0, width:0, height: 0};
    this.layoutConstraints = params.layoutConstraints || { width: 400, height: 400 };
    this.init();
  };

  ZoneCanvas.prototype = {
    init: function(){
      this.renderCanvas();
      this.renderDrawingCanvas();
      this.attachEvents();
    },
    renderCanvas: function(){
      var canvas = $("<canvas></canvas>");
      canvas.attr("width", this.$el.width());
      canvas.attr("height", this.$el.height());
      this.$el.append(canvas);
      this.canvas = canvas[0];
      this.$canvas = canvas;
      this.context = this.canvas.getContext("2d");
    },
    renderDrawingCanvas: function(){
      var canvas = $("<canvas class='drawing'></canvas>");
      canvas.attr("width", this.$el.width());
      canvas.attr("height", this.$el.height());
      this.$el.append(canvas);
      this.canvasDrawing = canvas[0];
      this.$canvasDrawing = canvas;
      this.contextDrawing = this.canvasDrawing.getContext("2d");
    },
    attachEvents:function(){
      this.attachDrawingEvents();
    },
    attachDrawingEvents: function(){
      var zoneCanvas = this;
      zoneCanvas.$canvasDrawing.on("mousedown", function(e){
        e.preventDefault();
        if(!zoneCanvas.image) return;
        zoneCanvas.drag = true;
        zoneCanvas.setMouseSelectionCoordinates( getMousePosition(zoneCanvas.canvas, e), true);
      }).on("mouseup", function(e){
        e.preventDefault();
        if(!zoneCanvas.drag) return;
        zoneCanvas.drag = false;
        zoneCanvas.setMouseSelectionCoordinates( getMousePosition(zoneCanvas.canvas, e), false);
        zoneCanvas.drawSelectionBox();
      }).on("mousemove", function(e){
        e.preventDefault()
        if(!zoneCanvas.drag) return;
        zoneCanvas.setMouseSelectionCoordinates( getMousePosition(zoneCanvas.canvas, e), false);
        zoneCanvas.drawSelectionBox();
      });
    },
    setMouseSelectionCoordinates: function(coordinates, startCoordinates){
      if(startCoordinates){
        this.selectionCoordinates.x = coordinates.x;
        this.selectionCoordinates.y = coordinates.y;
      }else{
        this.selectionCoordinates.width = coordinates.x - this.selectionCoordinates.x;
        this.selectionCoordinates.height = coordinates.y - this.selectionCoordinates.y;
      }
    },
    drawSelectionBox: function() {
      this.clear(this.canvasDrawing);
      this.contextDrawing.strokeRect(
        this.selectionCoordinates.x,
        this.selectionCoordinates.y,
        this.selectionCoordinates.width,
        this.selectionCoordinates.height
      );
      $(this).trigger("zoneselected", this.getStandardCoordinates());
    },
    selectCorner: function(){
      this.selectionCoordinates.x = this.canvas.width / 2;
      this.selectionCoordinates.y = this.canvas.height / 2;
      this.selectionCoordinates.width = this.canvas.width / 2;
      this.selectionCoordinates.height = this.canvas.height / 2;
      this.drawSelectionBox();
    },
    getStandardCoordinates: function(){
      var ratio = 1/this.zoomFactor,
        coords = this.selectionCoordinates,
        standardized =  {
          x: coords.x * ratio + this.viewZone.x,
          y: coords.y * ratio + this.viewZone.y,
          width: coords.width * ratio,
          height: coords.height * ratio
        };
      return standardized;
    },
    drawImage: function(image){
      this.image = image;
      this.context.drawImage(this.image, 0, 0);
    },
    clear: function(canvas){
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0,0, canvas.width, canvas.height );
    },
    drawZone: function(){
      this.clear(this.canvas);
      this.context.drawImage(
        this.image,
        this.viewZone.x,
        this.viewZone.y,
        this.viewZone.width,
        this.viewZone.height,
        0,
        0,
        this.viewZone.width * this.zoomFactor,
        this.viewZone.height * this.zoomFactor
      );
    },
    zoom: function(z){
      this.zoomFactor = z;
      this.setZone({ x:0, y:0, width:this.image.width, height:this.image.height });
      this.adjustCanvasDimensions(this.getOrientation());
      this.drawZone();
    },
    zoomIn: function(z){
      this.zoomFactor *= z || 2;
      this.zoom(this.zoomFactor);
    },
    zoomOut: function(z){
      this.zoomFactor /= z || 2;
      this.zoom(this.zoomFactor);
    },
    zoomZone: function(zone){
      this.setZone( this.normalizeZone(zone) );
      var orientation = this.getOrientation(),
        dimension = orientation ? "width" : "height";
      this.zoomFactor = ( this.layoutConstraints[dimension] || this.canvas[dimension] ) / zone[dimension];
      this.adjustCanvasDimensions(orientation);
      this.drawZone();
    },
    getOrientation: function(){
      var viewRatio = this.viewZone.width / this.viewZone.height;
      var constraintsRatio = (this.layoutConstraints.width || this.canvas.width) /
        (this.layoutConstraints.height || this.canvas.height);
      return viewRatio > constraintsRatio;
    },
    setZone: function(zone){
      this.viewZone = zone;
    },
    adjustCanvasDimensions: function(horizontal){
      var canvasHeight = this.viewZone.height * this.zoomFactor,
        canvasWidth = this.viewZone.width * this.zoomFactor;
      this.$canvas.attr("width", canvasWidth);
      this.$canvas.attr("height", canvasHeight);
      this.$canvasDrawing.attr("width", canvasWidth);
      this.$canvasDrawing.attr("height", canvasHeight);
      this.$el.css("width", canvasWidth);
      this.$el.css("height", canvasHeight);
    },
    // flips coordinates when negative widths and heights.
    normalizeZone: function(zone){
      if(zone.width<0){
        zone.x += zone.width;
        zone.width *= -1;
      }
      if(zone.height<0){
        zone.y += zone.height;
        zone.height *= -1;
      }
      return zone;
    },
    fit: function(){
      var fitRatio = Math.min(
        ( this.layoutConstraints.width || this.canvas.width ) / this.image.width,
        ( this.layoutConstraints.height || this.canvas.height ) / this.image.height
      );
      this.zoom(fitRatio);
    }
  };

  var getMousePosition = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  window.ZoneCanvas = ZoneCanvas;

})();
