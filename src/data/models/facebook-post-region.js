(function () {
  'use strict';
})();

var FacebookPostRegion = (function (api) {
  if (!api) {
    api = Model;
  }

  var endpoint = '/facebook/posts';

  function prepareData(data) {
    var preparedData = [];
    data.map(function (post) {
      if (post.insight_video_view_time_region_lifetime) {
        var regionData = JSON.parse(post.insight_video_view_time_region_lifetime);
        delete post.insight_video_view_time_region_lifetime; // delete this so it won't be cloned

        Object.keys(regionData).map(function (regionName) {
          var row = JSON.parse(JSON.stringify(post)); // clone post data
          row.region = regionName.replace(' - France', '');
          row.value = regionData[regionName];

          preparedData.push(row);
        });
      }
    });

    return preparedData;
  }

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
      fields: 'id,message,insight_video{view_time_region_lifetime}',
      darkPost: false,
      published: true,
      content_type: 'video_inline,video_direct_response',
      /* OTHER AVAILABLE PARAMS */
      // page_id,
      // ids,
      // urls,
      // search,
      // categories,
      // since,
      // until,
      // boosted,
      // brandContent,
      // repost,
      // pilot,
      // categorization_checked,

      /* FOR ORDERING */
      // order (order field, default created_time),
      // order_type (asc/desc, default desc),

      /* FOR PAGINATION */
      limit: 50000,
      // page,
    };

    if (request.dimensionsFilters) {
      var nodeId = FiltersHelper.getNodeId(request.dimensionsFilters);
      if (nodeId) {
        params.ids = nodeId;
      }

      var pageId = FiltersHelper.getPageId(request.dimensionsFilters);
      if (pageId) {
        params.page_id = pageId;
      }
    }

    if (overrideParams) {
      params = {...params, ...overrideParams};
    }

    var content = API.fetchData(endpoint, params, request.configParams.token);

    if (!content) {
      return null;
    }

    var data = prepareData(content.data);

    return data;
  };

  api.schema = function schema(request) {
    let schemaObject = {
      id: {
        name: 'id',
        label: 'id',
        dataType: DT.DIMENSION_NUMBER.type,
        semantics: DT.DIMENSION_NUMBER.semantics,
      },
      message: {
        name: 'message',
        label: 'message',
        dataType: DT.STRING.type,
        semantics: DT.STRING.semantics,
      },
      region: {
        name: 'region',
        label: 'region',
        dataType: DT.STRING.type,
        semantics: DT.STRING.semantics,
      },
      value: {
        name: 'value',
        label: 'value',
        dataType: DT.METRIC_NUMBER.type,
        semantics: DT.METRIC_NUMBER.semantics,
      },
    };

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
})(FacebookPostRegion || {});
