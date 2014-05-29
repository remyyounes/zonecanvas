;(function(){
  var CanvasDemo = function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("canvasDemo");
    this.imageUrl = params.imageUrl;
    this.canvases = [];
    this.init();
  };

  CanvasDemo.prototype = {
    init: function(){
      if(this.imageUrl) this.loadImage(this.imageUrl);
    },
    addCanvas: function(params){
      var canvas = $("<li></li>");
      this.canvases.push(new ZoneCanvas( {
        el: canvas,
        image: params.image,
        viewZone: params.viewZone
      }));
      this.$el.append(canvas);
    }
    showGrid: function(){

      var imgWidth = canvasDemo.image.width;
      var imgHeight = canvasDemo.image.height;
      var subdivisions = 4;
      var zone = {};
      for(var i = 1; i <= subdivisions; i*=2 ){
        zone.width = imgWidth/i;
        zone.height = imgHeight/i;
        zone.x = imgWidth - zone.width;
        zone.y = imgHeight - zone.height;
        canvasDemo.addCanvas({ image: canvasDemo.image, viewZone: zone });
      }
    },
    loadImage: function(file, zoom){
      var canvasDemo = this;
      zoom = zoom || 1;
      canvasDemo.image = new Image();
      canvasDemo.image.src = this.imageUrl;
      canvasDemo.image.onerror = function (e){ alert("Image loading error. " + e); };
      canvasDemo.image.onload = function(){ canvasDemo.showGrid(); };
    }
  };

  window.CanvasDemo = CanvasDemo;

})();
