// Examplifies the campaign resolution
(function(div) {
  // Some global variables
  var start=0,
    end=100,
    volume=100;
  // The model
  var model = new Proxy({
    campaigns: [
      {
        start:10,
        end:60,
        volume:50
      },
      {}
    ],
    controller: (model) => null
  }, {
    set: (model, property, value, receiver) => {
      model[property] = value;
      model.controller(model);
    }
  });
})(d3.select("solve-campaigns"));
