  ;(function(){
    var ZoneCanvas = function (params) {
      this.el = params.el[0];
      this.$el = params.el;
      this.$el.addClass("zoneCanvas");
      this.zoomFactor = params.zoomFactor || 1;
      this.drag = false;
      this.selectionCoordinates = {};
      this.viewZone = {x: 0, y: 0, width:0, height: 0};
      this.eventBus = $({});
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
          var mousePos = getMousePosition(zoneCanvas.canvas, e);
          zoneCanvas.selectionCoordinates.x = mousePos.x;
          zoneCanvas.selectionCoordinates.y = mousePos.y;
        }).on("mouseup", function(e){
          e.preventDefault();
          if(!zoneCanvas.drag) return;
          zoneCanvas.drag = false;
          var mousePos = getMousePosition(zoneCanvas.canvas, e);
          zoneCanvas.selectionCoordinates.width = mousePos.x - zoneCanvas.selectionCoordinates.x;
          zoneCanvas.selectionCoordinates.height = mousePos.y - zoneCanvas.selectionCoordinates.y;
        }).on("mousemove", function(e){
          e.preventDefault()
          if(zoneCanvas.drag){
            var mousePos = getMousePosition(zoneCanvas.canvas, e);
              zoneCanvas.selectionCoordinates.width = mousePos.x - zoneCanvas.selectionCoordinates.x;
              zoneCanvas.selectionCoordinates.height = mousePos.y - zoneCanvas.selectionCoordinates.y;
            $(zoneCanvas).trigger("zoneselected", zoneCanvas.getStandardCoordinates());
            zoneCanvas.drawSelectionBox();
          }
        });
      },
      drawSelectionBox: function() {
        this.clear(this.canvasDrawing);
        this.contextDrawing.strokeRect(
          this.selectionCoordinates.x,
          this.selectionCoordinates.y,
          this.selectionCoordinates.width,
          this.selectionCoordinates.height
        );
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
        ctx.clearRect(0,0,
          canvas.width,
          canvas.height
        );
      },
      zoom: function(z){
        this.clear(this.canvas);
        this.zoomFactor = z;
        this.viewZone = {
          x:0,
          y:0,
          width:this.image.width,
          height:this.image.height
        };
        this.context.drawImage(
          this.image,
          this.viewZone.x,
          this.viewZone.y,
          this.viewZone.width,
          this.viewZone.height,
          0,
          0,
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
        this.clear(this.canvas);
        zone = this.normalizeZone(zone);
        this.setZone(zone);
        this.zoomFactor = this.canvas.width / zone.width;

        this.adjustCanvasDimensions();

        this.context.drawImage(
          this.image,
          this.viewZone.x,
          this.viewZone.y,
          this.viewZone.width,
          this.viewZone.height,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        )
      },
      setZone: function(zone){
        this.viewZone = zone;
      },
      adjustCanvasDimensions: function(){
        // resize Canvas
        this.$canvas.attr("height", this.viewZone.height * this.zoomFactor );
        this.$canvasDrawing.attr("height", this.viewZone.height * this.zoomFactor );
        this.$canvas.parent().css("height", this.viewZone.height * this.zoomFactor );
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
