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
      this.renderInfo();
      this.renderControls();
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
    renderInfo: function(){
      this.$info = $("<div class='info'>info</div>");
      this.$el.append(this.$info);
    },
    renderControls: function(){
      var controls = $("<div class='controls'></div>");
      this.$el.append(controls);
      this.controls = new ZoneFragmentControls({ el: controls });
    },
    attachHandlers: function(){
      var zoneFragment = this;
      $(this.controls).on("submit", function(e, data){
        $(zoneFragment).trigger("zonesaved", [data]);
      });
      $(this.controls).on("cancel", function(e, data){
        debugger;
        $(zoneFragment).trigger("zonecancelled", [data]);
      });
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

  var ZoneFragmentControls = function(params){
    this.zoomFactor = params.zoomFactor || 1;
    this.el = params.el[0];
    this.$el = params.el;
    this.init();
  };

  ZoneFragmentControls.prototype = {
    init: function(){
      this.render();
      this.attachHandlers();
    },
    render: function(){
      this.$saveBtn = $("<div class='save'>save</div>");
      this.$cancelBtn = $("<div class='cancel'>cancel</div>");
      this.$el.append(this.$cancelBtn);
      this.$el.append(this.$saveBtn);
    },
    attachHandlers: function(){
      var controls = this;
      this.$saveBtn.on("click", function(){
        $(controls).trigger("submit" ,[{}]);
      });
      this.$cancelBtn.on("click", function(){
        debugger;
        $(controls).trigger("cancel" ,[{}]);
      });
    }
  };

  window.ZoneFragment = ZoneFragment;
})();
