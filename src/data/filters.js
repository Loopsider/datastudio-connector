(function () {
  'use strict';
})();

var Filters = (function (api) {
  api.getNodeId = function getNodeId(filters) {
    var orFilters = filters ? filters[0] : [];
    var nodeId = orFilters
      .map(function (filter) {
        if (filter.fieldName === 'id') {
          return filter.values.join(',');
        }
        return null;
      })
      .filter(function (filter) {
        return filter !== null;
      })
      .join(',');

    return nodeId;
  };

  return api;
})(Filters || {});
