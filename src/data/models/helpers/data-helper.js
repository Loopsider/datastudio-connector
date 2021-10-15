(function () {
  'use strict';
})();

var DataHelper = (function (api) {
  api.prepare = function prepare(data, fields, requestedFields) {
    var flat = FieldsParamHelper.getFlattenArray(fields, requestedFields);

    data = data.map(function (row) {
      Object.keys(row).map(function (key) {
        if (flat[key] && flat[key].prepare) {
          row[key] = flat[key].prepare(row[key]);
        }
      });
      return row;
    });

    return data;
  };

  return api;
})(DataHelper || {});
