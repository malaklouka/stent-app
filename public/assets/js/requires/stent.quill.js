stent.quill = function(id, jElem) {

  return new Quill(jElem.get(0), {
    modules: {
      toolbar: [["bold", "italic"], ["link", "blockquote", "code", "image"], [{"list": "ordered"}, {"list": "bullet"}]]
    },
    theme: "snow"
  });

};