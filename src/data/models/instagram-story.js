(function () {
  'use strict';
})();

var InstagramStory = (function (api) {
  var endpoint;
  var fields;

  api._init = function _init() {
    endpoint = '/instagram/stories';
    fields = {
      id: DT.DIMENSION_NUMBER,
      created_time: DT.DATETIME,
      media_type: DT.STRING,
      permalink: DT.URL,
      media_url: DT.URL,
      thumbnail_url: DT.URL,
      storage_thumbnail: DT.STRING,
      storage_file: DT.STRING,
      deleted: DT.BOOLEAN,
      account: {
        name: DT.STRING,
        profile_picture_url: DT.URL,
        picture_file: DT.STRING,
      },
      insight: {
        exits_lifetime: DT.METRIC_NUMBER,
        reach_lifetime: DT.METRIC_NUMBER,
        impressions_lifetime: DT.METRIC_NUMBER,
        replies_lifetime: DT.METRIC_NUMBER,
        taps_forward_lifetime: DT.METRIC_NUMBER,
        taps_back_lifetime: DT.METRIC_NUMBER,
      },
    };
  };

  /**
   * Find All rows from facebook-posts by querying the loopsider API
   *
   * @param   {Object}  request                           Datastudio Connector Request Object
   *    @param   {Object}  request.configParams
   *      @param   {String}  request.configParams.token
   *    @param   {Object}  request.fieds
   *    @param   {Object}  request.dimensionsFilters
   * @param   {Object} overrideParams
   * @return  {Array}                                     API result data (result.data)
   */
  api.findAll = function findAll(request, overrideParams) {
    var params = {
      fields: FieldsParamHelper.getFieldsString(fields, request.fields),
      published: true,
      /* OTHER AVAILABLE PARAMS */
      // page_id
      // ids
      // since
      // until

      /* FOR ORDERING */
      // order (order field, default created_time),
      // order_type (asc/desc, default desc),

      /* FOR PAGINATION */
      limit: 1000,
      // page,
    };

    if (request.dateRange && request.dateRange.startDate && request.dateRange.endDate) {
      params.since = request.dateRange.startDate;
      params.until = request.dateRange.endDate;
    }
    if (request.dimensionsFilters) {
      var nodeId = FiltersHelper.getNodeId(request.dimensionsFilters);
      if (nodeId) {
        params.ids = nodeId;
      }
    }

    if (overrideParams) {
      params = {...params, ...overrideParams};
    }

    var content = API.fetchData(endpoint, params, request.configParams.token);
    var data = DataHelper.prepare(content ? content.data : [], fields, request.fields);

    return data;
  };

  api.schema = function schema(request) {
    var flat = FieldsParamHelper.getFlattenArray(fields, request.fields);

    var schemaObject = {};
    Object.keys(flat).map(function (fieldName) {
      schemaObject[fieldName] = {
        name: fieldName,
        label: fieldName,
        dataType: flat[fieldName].type,
        semantics: flat[fieldName].semantics,
      };
    });

    var schemaArray = [];
    if (request.fields) {
      schemaArray = request.fields.map(function (requestedField) {
        return schemaObject[requestedField.name];
      });
    } else {
      schemaArray = Object.values(schemaObject);
    }

    return schemaArray;
  };

  return api;
})(InstagramStory || {});
