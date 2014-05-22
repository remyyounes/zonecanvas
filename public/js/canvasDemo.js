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
      this.attachHandlers();
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
    },
    attachHandlers: function(){

    },
    showGrid: function(){

      canvasDemo.addCanvas({
        image: canvasDemo.image
      });

      canvasDemo.addCanvas({
        image: canvasDemo.image,
        viewZone: {x: 0, y: 0, width: 200, height:300 }
      });

      canvasDemo.addCanvas({
        image: canvasDemo.image,
        viewZone: {x: 200, y: 300, width: 400, height:600 }
      });

      // canvasDemo.addCanvas({
      //   image: canvasDemo.image,
      //   viewZone: {x: 400, y: 0, width: 200, height:300 }
      // });

      canvasDemo.addCanvas({
        image: canvasDemo.image,
        viewZone: {x: 600, y: 900, width: 200, height:300 }
      });


    },
    loadImage: function(file, zoom){
      var canvasDemo = this;
      zoom = zoom || 1;

      canvasDemo.image = new Image();
      canvasDemo.image.src = this.imageUrl;
      canvasDemo.image.onerror = function (e){ alert("Image loading error. " + e); };
      canvasDemo.image.onload = function(){ canvasDemo.showGrid(); };
    }
  }

  window.CanvasDemo = CanvasDemo;

})();
