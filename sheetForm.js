;(function(){
  var SheetForm = function(params){
    this.$el = params.el;
    this.el = params.el[0];
    this.fields = params.fields || { title: "", drawingId: "" };
    this.init();
  };

  SheetForm.prototype = {
    init: function(){
      this.renderFields();
      this.attachHandlers();
    },
    renderFields: function(){
      var sheetForm = this;
      for(f in this.fields){
        var prop = $("<div><label>"+f+"</label>");
        var input = $("<input name='"+f+"'/>");
        prop.append(input);
        this.$el.append(prop);
        input.on("click", function(){
          $(sheetForm).trigger("zonerequested", [{field: this.name}]);
        });
      }
    },
    attachHandlers: function(){


    }
  };

  window.SheetForm = SheetForm;
})();
