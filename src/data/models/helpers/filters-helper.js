(function () {
  'use strict';
})();

var FiltersHelper = (function (api) {
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

  api.getPageId = function getPageId(filters) {
    var orFilters = filters ? filters[0] : [];
    var page_id = orFilters
      .map(function (filter) {
        if (filter.fieldName === 'page_id') {
          return filter.values.join(',');
        }
        return null;
      })
      .filter(function (filter) {
        return filter !== null;
      })
      .join(',');

    return page_id;
  };

  return api;
})(FiltersHelper || {});
