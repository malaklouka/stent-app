stent.list = (function() {
  var _lists = {};
  var add = function ($list, options) {
    let _id = $list.attr("id") || "_" + stent.utils.guid();
    _lists[_id] = new List($list.get(0), options);
  };
  const init = function () {};
  return {
    init: init,
    add: add,
    get: function () {
      return _lists;
    }
  };
})();