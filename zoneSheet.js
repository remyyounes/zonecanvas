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
      this.renderPicker();
      this.renderForm();
      this.renderFragment();
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
    renderFragment: function(){
      var fragment = $("<div class='fragment'></div>");
      this.fragment = new ZoneFragment({
        el: fragment,
        layoutConstraints: { width: 200, height: 200}
      });
      this.fragment.setImage(this.image);
      this.$fragment = fragment;
      this.$el.append(fragment);
    },
    renderPicker: function(){
      var picker = $("<div class='picker'></div>");
      this.picker = new ZonePicker({
        el: picker,
        layoutConstraints: { width: 500, height: 500}
      });
      this.picker.setImage(this.image);
      this.$picker = picker;
      this.$el.append(picker);
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
        zoneSheet.picker.zoomZone(data);
      });
      $(this.picker).on("zoneselected", function(event, data){
        zoneSheet.fragment.zoomZone(data);
      });

      $(this.form).on("zonerequested", function(event, data){
        zoneSheet.showZonePicker(data);
      });

      $(this.fragment).on("zonesaved", function(event, data){
        // this.recordZone(currentAttribute, fragment.getZone());
      });

      $(this.fragment).on("zonecancelled", function(event, data){
        zoneSheet.hideZonePicker();
      });
    },
    showZonePicker: function(data){
      this.fragment.setInfo(data.field, data.value);
      this.$el.addClass("picking");
    },
    hideZonePicker: function(){
      this.$el.removeClass("picking");
    }

  };

  window.ZoneSheet = ZoneSheet;

})();
