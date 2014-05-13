;(function(){
  var ZoneSheet = function(params){
    this.$el = params.el;
    this.el = params.el[0];
    this.$el.addClass("zoneSheet");
    this.image = params.image;
    this.init();
  };

  ZoneSheet.prototype = {
    init: function(){
      this.renderNavigator();
      this.renderForm();
      this.attachHandlers();
    },
    renderNavigator: function(){
      var navigator = $("<div class='navigator'></div>");
      this.navigator = new ZoneNavigator({
        el: navigator,
        layoutConstraints: { width: 200, height: 200}
      });
      this.navigator.setImage(this.image);
      this.$el.append(navigator);
    },
    renderForm: function(){
      var form = $("<div class='form'></div>");
      this.form = new SheetForm({
        el: form
      });
      this.$el.append(form);
    },
    attachHandlers: function(){
      var zoneSheet = this;
      $(this.navigator).on("zoneselected", function(event, data){
        // zoneSheet.picker.zoomZone(data);
      });

      $(this.form).on("zonerequested", function(event, data){
        zoneSheet.showZonePicker();
      });

      $(this.currentFragment).on("zoneaccepted", function(event, data){
        this.recordZone(currentAttribute, currentFragment.getZone())
      });
    },
    showZonePicker: function(){
      console.log("showZonePicker Stub");
    }

  };

  window.ZoneSheet = ZoneSheet;

})();
