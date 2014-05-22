;(function(){
  var ZoneExtractor = function (params) {
    this.el = params.el[0];
    this.$el = params.el;
    this.$el.addClass("zoneExtractor");
    this.zoomFactor = params.zoomFactor || 1;
    this.init();
  };

  ZoneExtractor.prototype = {
    init: function(){
      this.render();
      this.attachHandlers();
    },
    render: function(){
      this.renderNavigator();
      this.renderPicker();
      this.renderFragments();
    },
    renderNavigator: function(){
      var navigator = $("<div class='navigator'></div>");
      this.$el.append(navigator);
      this.navigator = new ZoneNavigator({
        el: navigator,
        layoutConstraints: {width: 200, height: 200}
      });
    },
    renderPicker: function(){
      var picker = $("<div class='picker'></div>");
      this.$el.append(picker);
      this.picker = new ZonePicker({
        el: picker,
        layoutConstraints: {width: 500, height: 600}
      });
    },
    renderFragments: function(){
      var fragment = $("<div class='fragment'></div>");
      this.$el.append(fragment);
      this.fragment = new ZoneFragment({
        el: fragment,
        layoutConstraints: {width: 200, height: 200}
      });
    },
    attachHandlers: function(){
      var zoneExtractor = this;
      $(this.navigator).on("zoneselected", function(event, data){
        zoneExtractor.picker.zoomZone(data);
      });
      $(this.picker).on("zoneselected", function(event, data){
        debugger;
        zoneExtractor.fragment.zoomZone(data);
      });

      this.attachFilerDropHandler();
    },
    attachFilerDropHandler: function(){
      var zoneExtractor = this;
      document.body.ondragover = function(){ return false };
      document.body.ondragend = function(){ return false };
      document.body.ondrop = function(e){
        e.preventDefault();
        zoneExtractor.load(e.dataTransfer.files[0]);
        return false;
      };
    },
    load: function(file, zoom){
      var zoneExtractor = this;
      zoom = zoom || 1;

      var ext = file.name.split('.').slice(-1)[0];
      var reader = new FileReader();

      reader.onload = function (){
        zoneExtractor.image = new Image();
        zoneExtractor.image.src = reader.result;
        zoneExtractor.image.onerror = function (e){ alert("image loading error. " + e); };
        zoneExtractor.image.onload = function(){
          zoneExtractor.navigator.setImage(zoneExtractor.image);
          zoneExtractor.picker.setImage(zoneExtractor.image);
          zoneExtractor.fragment.setImage(zoneExtractor.image);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  window.ZoneExtractor = ZoneExtractor;

})();
