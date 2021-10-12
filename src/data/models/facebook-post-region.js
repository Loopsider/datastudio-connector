(function () {
  'use strict';
})();

var FacebookPostRegion = (function (api) {
  if (!api) {
    api = Model;
  }

  var endpoint = '/facebook/posts';

  function prepareData(data) {
    console.log(data);
    var preparedData = [];
    data.map(function (post) {
      if (post.insight_video_view_time_region_lifetime) {
        var regionData = JSON.parse(post.insight_video_view_time_region_lifetime);
        delete post.insight_video_view_time_region_lifetime; // delete this so it won't be cloned

        Object.keys(regionData).map(function (regionName) {
          var row = JSON.parse(JSON.stringify(post)); // clone post data
          row.region = regionName;
          row.value = regionData[regionName];

          preparedData.push(row);
        });
      }
    });
    console.log(preparedData);
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
      // limit,
      // page,
    };

    if (request.dimensionsFilters) {
      var nodeId = FiltersHelper.getNodeId(request.dimensionsFilters);
      params.ids = nodeId;
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

  return api;
})(FacebookPostRegion || {});
