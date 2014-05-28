;(function(){
  var ZoneSheet = function(params){
    this.$el = params.el;
    this.el = params.el[0];
    this.$el.addClass("zoneSheet");
    this.image = params.image;
    this.page = params.page;
    this.documentId = params.documentId;
    this.ocrEngine = params.ocrEngine;
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
        layoutConstraints: { width: 200, height: 200},
        ocrEngine: this.ocrEngine,
        documentId: this.documentId,
        page: this.page
      });
      this.fragment.setImage(this.image);
      this.$fragment = fragment;
      this.$el.append(fragment);
    },
    renderPicker: function(){
      var picker = $("<div class='picker'></div>");
      this.picker = new ZonePicker({
        el: picker,
        layoutConstraints: { width: 600, height: 450}
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
        zoneSheet.form.setValue(this.name, data.info[this.name]);
        zoneSheet.hideZonePicker();
      }).on("zonecancelled", function(event, data){
        zoneSheet.hideZonePicker();
      });
    },
    showZonePicker: function(data){
      this.fragment.clearInfo();
      this.fragment.setName(data.field, data.value);
      this.navigator.selectCorner();
      this.picker.viewport.selectCorner();
      this.$el.addClass("picking");
    },
    hideZonePicker: function(){
      this.$el.removeClass("picking");
    }

  };

  window.ZoneSheet = ZoneSheet;

})();
