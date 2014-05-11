;(function(){
  var ZoneCanvas = function (params) {
    this.canvas = params.canvas[0];
    this.$canvas = params.canvas;
    this.context = this.canvas.getContext("2d");
    this.zoomFactor = params.zoomFactor || 1;
    this.drag = false;
    this.selectionCoordinates = {};
    this.init();
  };

  ZoneCanvas.prototype = {
    init: function(){
      this.attachEvents();
    },
    attachEvents:function(){

      zoneCanvas = this;

      zoneCanvas.canvas.onmousedown = function(e){
        e.preventDefault();
        zoneCanvas.drag = true;
        var mousePos = getMousePosition(zoneCanvas.canvas, e);
        zoneCanvas.selectionCoordinates.x = mousePos.x;
        zoneCanvas.selectionCoordinates.y = mousePos.y;
        zoneCanvas.canvas.onmousemove(e);
      };
      zoneCanvas.canvas.onmouseup = function(e){
        e.preventDefault();
        zoneCanvas.drag = false;
        var mousePos = getMousePosition(zoneCanvas.canvas, e);
        zoneCanvas.selectionCoordinates.width = mousePos.x - zoneCanvas.selectionCoordinates.x;
        zoneCanvas.selectionCoordinates.height = mousePos.y - zoneCanvas.selectionCoordinates.y;
      };
      zoneCanvas.canvas.onmousemove = function(e){
        e.preventDefault()
        // if(!zoneCanvas.currentImg) return;
        if(zoneCanvas.drag){
          var mousePos = getMousePosition(zoneCanvas.canvas, e);
          zoneCanvas.selectionCoordinates.width = mousePos.x - zoneCanvas.selectionCoordinates.x;
          zoneCanvas.selectionCoordinates.height = mousePos.y - zoneCanvas.selectionCoordinates.y;
        $(zoneCanvas).trigger("zoneselected", zoneCanvas.selectionCoordinates);
          // reset_canvas(zoneCanvas.canvas);
          // zoneCanvas.contextPrimary.drawImage( zoneCanvas.currentImg, 0, 0 );
          // zoneCanvas.drawSelectionBox(zoneCanvas.contextPrimary);
        }
      };
    },
    drawImage: function(image){
      this.image = image;
      this.context.drawImage(this.image, 0, 0);
    },
    clear: function(){
      this.context.fillStyle = "white";
      this.context.fillRect(0,0,
        this.canvas.width,
        this.canvas.height
      );
      this.context.fillStyle = "black";
    },
    zoom: function(z){
      this.clear();
      this.zoomFactor = z;
      this.context.drawImage(
        this.image, 0, 0,
        this.image.width * this.zoomFactor,
        this.image.height * this.zoomFactor
      );
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
      var ratio = Math.min(
        this.canvas.width / zone.width,
        this.canvas.height / zone.height
      );
      this.context.drawImage(
        this.image,
        zone.x, zone.y,
        zone.width, zone.height,
        0, 0,
        this.image.width * ratio,
        this.image.height * ratio
      );
    },
    fit: function(){
      var fitRatio = Math.min(
        this.canvas.width / this.image.width,
        this.canvas.height / this.image.height
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
