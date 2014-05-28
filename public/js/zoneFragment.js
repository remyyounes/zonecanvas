;(function(){
  var ZoneFragment = function(params){
    this.zoomFactor = params.zoomFactor || 1;
    this.el = params.el[0];
    this.$el = params.el;
    this.info = params.info || {};
    this.layoutConstraints = params.layoutConstraints;
    this.name = "";
    this.ocrEngine = params.ocrEngine;
    this.page = params.page;
    this.documentId = params.documentId;
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
      var rendered = this.$info ? true : false;
      this.$info = this.$info || $("<ul class='info'></ul>");
      this.$info.empty();
      for( var field in this.info )
        this.$info.append("<li><label>"+field+"</label>"+this.info[field]+"</li>");
      if(!rendered) this.$el.append(this.$info);
    },
    renderControls: function(){
      var controls = $("<div class='controls'></div>");
      this.$el.append(controls);
      this.controls = new ZoneFragmentControls({ el: controls });
    },
    attachHandlers: function(){
      var zoneFragment = this;
      $(this.controls).on("submit", function(e, data){
        data.info = zoneFragment.info;
        $(zoneFragment).trigger("zonesaved", [data]);
      });
      $(this.controls).on("cancel", function(e, data){
        $(zoneFragment).trigger("zonecancelled", [data]);
      });
    },
    clearInfo: function(){
      this.info = {};
    },
    setInfo: function(attr, value){
      this.info[attr] = value;
      this.renderInfo();
    },
    setName: function(attr, value){
      this.name = attr;
      this.setInfo(attr, value);
    },
    zoomZone: function(zone){
      if(!zone.width || !zone.height) return;
      this.viewport.zoomZone(zone);
      this.runOCR(this.viewport.getImageData());
      for(coord in zone)
        this.setInfo(coord, Math.round(zone[coord]));
    },
    setImage: function(image){
      this.image = image;
      this.viewport.drawImage(this.image);
      this.viewport.fit();
    },
    runOCR: function(image_data){
      // this.runOcradOCR(image_data);
      var imageData = this.viewport.canvas.toDataURL();
      this.runTesseractOCR(imageData);
    },
    runTesseractOCR: function(image_data){
      var zoneFragment = this;
      debugger;
      var zone = this.viewport.viewZone;
      // var data = {image_data: image_data};
      var data = {
        documentId: this.documentId,
        page: this.page,
        zoneName: "title",
        zone: zone
      };
      this.ocrEngine.asyncOcr(data, function(data){
        zoneFragment.ocrResultHandler( { result: data.result } );
      });
    },
    runOcradOCR: function(image_data){
      var zoneFragment = this;
      window.ocradWorker.onmessage = function(e){
        var processingTime = ((Date.now() - start)/1000).toFixed(2);
        zoneFragment.ocrResultHandler( { result: e.data, time: processingTime } );
      }
      var start = Date.now()
      window.ocradWorker.postMessage(image_data)
    },
    ocrResultHandler: function(data){
      this.setName(this.name, data.result);
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
        $(controls).trigger("cancel" ,[{}]);
      });
    }
  };

  window.ZoneFragment = ZoneFragment;
})();
