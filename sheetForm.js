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
        var input = $("<div class='zoneInput'><input name='"+f+"'/><button>zone</button>");
        prop.append(input);
        this.$el.append(prop);
        input.on("click", "button", function(){
          var inputField = $(this).parent().find("input");
          $(sheetForm).trigger("zonerequested", [{
              field: inputField.attr("name"),
              value: inputField.val()
          }]);
        });
      }
    },
    setValue: function(attribute, value){
      this.$el.find("input[name='"+attribute+"']").val(value);
    },
    attachHandlers: function(){


    }
  };

  window.SheetForm = SheetForm;
})();
