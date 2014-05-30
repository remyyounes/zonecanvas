;(function(){
  var DocumentCanvas = Function.Extend(function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("documentCanvas");
    this.zoomFactor = params.zoomFactor || 1;
    this.drag = false;
    this.selectionCoordinates = {};
    this.layoutConstraints = params.layoutConstraints || { width: 400, height: 400 };
    this.setViewZone( params.viewZone || {x: 0, y: 0, width:0, height: 0} );
    this.setImage(params.image);
    this.navigator = params.navigator || false;
    this.$canvases = $();
    this.init();
  }, { getType: function() { return this.Constructor.name; }});

  DocumentCanvas.prototype.init = function(){
    this.renderCanvas();
    this.render();
    this.attachEvents();
  };
  DocumentCanvas.prototype.render = function(){
    if(!this.image) return;
    if(this.viewZone.width > 0)
      this.zoomZone(this.viewZone);
    else
      this.fit();
  };
  DocumentCanvas.prototype.renderCanvas = function(){
    var canvas = $("<canvas></canvas>");
    canvas.attr("width", this.$el.width());
    canvas.attr("height", this.$el.height());
    this.$el.append(canvas);
    this.canvas = canvas[0];
    this.$canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.$canvases = this.$canvases.add(this.$canvas);
  };
  DocumentCanvas.prototype.attachEvents = function(){
  };

  DocumentCanvas.prototype.getPreviewSize = function(){
    return {width: this.canvas.width / 4, height: this.canvas.height / 4};
  };

  DocumentCanvas.prototype.getStandardCoordinates = function(){
    var ratio = 1/this.zoomFactor,
      zone = this.selectionCoordinates,
      standardized =  {
        x: zone.x * ratio + this.viewZone.x,
        y: zone.y * ratio + this.viewZone.y,
        width: zone.width * ratio,
        height: zone.height * ratio
      };
    return standardized;
  };
  DocumentCanvas.prototype.getLocalCoordinates = function(zone){
    var ratio = this.zoomFactor,
      localized =  {
        x: zone.x * ratio,// + this.viewZone.x,
        y: zone.y * ratio,// + this.viewZone.y,
        width: zone.width * ratio,
        height: zone.height * ratio
      };
    return localized;
  };
  DocumentCanvas.prototype.setImage = function(image){
    this.image = image;
  };
  DocumentCanvas.prototype.drawImage = function(image){
    this.image = image;
    this.context.drawImage(this.image, 0, 0);
  };
  DocumentCanvas.prototype.clear = function(canvas){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0, canvas.width, canvas.height );
  };
  DocumentCanvas.prototype.fillBackground = function(){
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(
      0,
      0,
      this.viewZone.width * this.zoomFactor,
      this.viewZone.height * this.zoomFactor
    );
  };
  DocumentCanvas.prototype.drawZone = function(){
    this.fillBackground();
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
  };
  DocumentCanvas.prototype.zoom = function(z){
    this.zoomFactor = z;
    this.setViewZone({ x:0, y:0, width:this.image.width, height:this.image.height });
    this.adjustCanvasDimensions(this.getOrientation());
    this.drawZone();
  };
  DocumentCanvas.prototype.zoomIn = function(z){
    this.zoomFactor *= z || 2;
    this.zoom(this.zoomFactor);
  };
  DocumentCanvas.prototype.zoomOut = function(z){
    this.zoomFactor /= z || 2;
    this.zoom(this.zoomFactor);
  };
  DocumentCanvas.prototype.zoomZone = function(zone){
    this.setViewZone( this.normalizeZone(zone) );
    var orientation = this.getOrientation(),
      dimension = orientation ? "width" : "height";
    this.zoomFactor = ( this.layoutConstraints[dimension] || this.canvas[dimension] ) / zone[dimension];
    this.adjustCanvasDimensions(orientation);
    this.drawZone();
  };
  DocumentCanvas.prototype.getOrientation = function(){
    var viewRatio = this.viewZone.width / this.viewZone.height;
    var constraintsRatio = this.getConstraintsRatio();
    return viewRatio > constraintsRatio;
  };
  DocumentCanvas.prototype.getConstraintsRatio = function(){
    return ((this.layoutConstraints.width || this.canvas.width) /
      (this.layoutConstraints.height || this.canvas.height));
  };
  DocumentCanvas.prototype.setViewZone = function(zone){
    this.viewZone = zone;
  };
  DocumentCanvas.prototype.adjustCanvasDimensions = function(horizontal){
    var canvasHeight = this.viewZone.height * this.zoomFactor,
      canvasWidth = this.viewZone.width * this.zoomFactor,
      canvasLeft = ((this.layoutConstraints.width || canvasWidth ) - canvasWidth) / 2,
      canvasTop = ((this.layoutConstraints.height || canvasHeight ) - canvasHeight) / 2;

    this.$canvases.attr("width", canvasWidth);
    this.$canvases.attr("height", canvasHeight);
    this.$canvases.css("left", canvasLeft);
    this.$canvases.css("top", canvasTop);

    this.$el.css("width", this.layoutConstraints.width || canvasWidth);
    this.$el.css("height", this.layoutConstraints.height || canvasHeight);
  };
  // flips coordinates when negative widths and heights.
  DocumentCanvas.prototype.normalizeZone = function(zone){
    if(zone.width<0){
      zone.x += zone.width;
      zone.width *= -1;
    }
    if(zone.height<0){
      zone.y += zone.height;
      zone.height *= -1;
    }
    return zone;
  };
  DocumentCanvas.prototype.fit = function(){
    var fitRatio = Math.min(
      ( this.layoutConstraints.width || this.canvas.width ) / this.image.width,
      ( this.layoutConstraints.height || this.canvas.height ) / this.image.height
    );
    this.zoom(fitRatio);
  };
  DocumentCanvas.prototype.getImageData = function(){
    return this.context.getImageData(0,0, this.canvas.width, this.canvas.height);
  };

  DocumentCanvas.prototype.getMousePosition = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  window.DocumentCanvas = DocumentCanvas;

})();
