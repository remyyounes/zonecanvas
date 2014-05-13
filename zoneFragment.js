;(function(){
  var ZoneFragment = function(params){
    this.zoomFactor = params.zoomFactor || 1;
    this.el = params.el[0];
    this.$el = params.el;
    this.layoutConstraints = params.layoutConstraints;
    this.init();
  };

  ZoneFragment.prototype = {
    init: function(){
      this.render();
      this.attachHandlers();
    },
    render: function(){
      var viewport = $("<div class='fragmentCanvas'></div>");
      this.$el.append(viewport);
      this.viewport = new ZoneCanvas({
        el: viewport,
        layoutConstraints: this.layoutConstraints
      });
    },
    attachHandlers: function(){
      // var zoneFragment = this;
      // $(this.viewport).on("zoneselected", function(e, data){
      //   $(zoneFragment).trigger("zoneselected", [data]);
      // });
    },
    zoomZone: function(zone){
      this.viewport.zoomZone(zone);
    },
    setImage: function(image){
      this.image = image;
      this.viewport.drawImage(this.image);
      this.viewport.fit();
    }
  };

  window.ZoneFragment = ZoneFragment;
})();
