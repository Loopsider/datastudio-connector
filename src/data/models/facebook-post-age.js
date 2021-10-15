(function () {
  'use strict';
})();

var FacebookPostAge = (function (api) {
  if (!api) {
    api = Model;
  }

  var endpoint = '/facebook/posts';

  function prepareData(data) {
    console.log(data);
    var preparedData = [];
    data.map(function (post) {
      if (post.insight_video_age_gender_json) {
        var ageData = post.insight_video_age_gender_json;
        delete post.insight_video_age_gender_json; // delete this so it won't be cloned

        Object.keys(ageData).map(function (regionName) {
          var row = JSON.parse(JSON.stringify(post)); // clone post data
          row = {...row, ...ageData};

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
      fields: 'id,message,insight_video{age_gender_json}',
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

  api.schema = function schema(request) {
    return [
      {
        name: 'id',
        label: 'id',
        dataType: DT.DIMENSION_NUMBER.type,
        semantics: {
          conceptType: DT.DIMENSION_NUMBER.concept,
        },
      },
      {
        name: 'message',
        label: 'message',
        dataType: DT.STRING.type,
        semantics: {
          conceptType: DT.STRING.concept,
        },
      },
      {
        name: 'bucket',
        label: 'bucket',
        dataType: DT.STRING.type,
        semantics: {
          conceptType: DT.STRING.concept,
        },
      },
      {
        name: 'value',
        label: 'value',
        dataType: DT.METRIC_NUMBER.type,
        semantics: {
          conceptType: DT.METRIC_NUMBER.concept,
        },
      },
    ];
  };

  return api;
})(FacebookPostAge || {});
