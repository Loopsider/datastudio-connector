(function () {
  'use strict';
})();

var FacebookPost = (function (api) {
  var endpoint;
  var fields;

  api._init = function _init() {
    endpoint = '/facebook/posts';
    fields = {
      id: DT.DIMENSION_NUMBER,
      message: DT.STRING,
      created_time: DT.DATETIME,
      sponsor: {
        picture_file: DT.STRING,
        name: DT.STRING,
        network_id: DT.STRING,
      },
      permalink_url: DT.URL,
      ads: DT.BOOLEAN,
      category: DT.DIMENSION_NUMBER,
      categorization_is_corrected: DT.BOOLEAN,
      page: {
        id: DT.DIMENSION_NUMBER,
        name: DT.STRING,
        picture_file: DT.STRING,
        is_pilot_page: DT.BOOLEAN,
        picture: DT.STRING,
      },
      attachment: {
        thumbnail: DT.STRING,
        storage_thumbnail: DT.STRING,
        type: DT.STRING,
        source: DT.STRING,
        title: DT.STRING,
        url: DT.URL,
        storage_file: DT.STRING,
        screenshot_0: DT.STRING,
        screenshot_3: DT.STRING,
        screenshot_6: DT.STRING,
        screenshot_10: DT.STRING,
      },
      insight_video: {
        length_lifetime: DT.METRIC_NUMBER,
        views_lifetime: DT.METRIC_NUMBER,
        views_10s_lifetime: DT.METRIC_NUMBER,
        views_30s_lifetime: DT.METRIC_NUMBER,
        views_15s_computed: DT.METRIC_NUMBER,
        views_60s_computed: DT.METRIC_NUMBER,
        avg_time_watched_lifetime: DT.METRIC_NUMBER,
        view_time_lifetime: DT.METRIC_NUMBER,
        complete_views_organic_lifetime: DT.METRIC_NUMBER,
        complete_views_paid_lifetime: DT.METRIC_NUMBER,
        ad_break_ad_impressions_lifetime: DT.METRIC_NUMBER,
        ad_break_earnings_lifetime: DT.METRIC_NUMBER,
        ad_break_ad_cpm_lifetime: DT.METRIC_NUMBER,
      },
      insight_engagement: {
        engaged_users_lifetime: DT.METRIC_NUMBER,
        clicks_lifetime: DT.METRIC_NUMBER,
        comments: DT.METRIC_NUMBER,
        shares: DT.METRIC_NUMBER,
      },
      insight_impression: {
        total_lifetime: DT.METRIC_NUMBER,
        viral_lifetime: DT.METRIC_NUMBER,
        nonviral_lifetime: DT.METRIC_NUMBER,
        fan_lifetime: DT.METRIC_NUMBER,
      },
      insight_reaction: {
        like_total_lifetime: DT.METRIC_NUMBER,
        love_total_lifetime: DT.METRIC_NUMBER,
        wow_total_lifetime: DT.METRIC_NUMBER,
        haha_total_lifetime: DT.METRIC_NUMBER,
        sorry_total_lifetime: DT.METRIC_NUMBER,
        anger_total_lifetime: DT.METRIC_NUMBER,
      },
      insight_score: {
        score_retention: DT.METRIC_NUMBER_PERCENT,
        score_interaction: DT.METRIC_NUMBER_PERCENT,
        score_captation: DT.METRIC_NUMBER_PERCENT,
        score_captation_6s: DT.METRIC_NUMBER_PERCENT,
        score_captation_10s: DT.METRIC_NUMBER_PERCENT,
        score_distribution: DT.METRIC_NUMBER,
      },
      insight_benchmark: {
        video_views: DT.METRIC_NUMBER,
        video_views_10s: DT.METRIC_NUMBER,
        video_views_30s: DT.METRIC_NUMBER,
        video_views_60s: DT.METRIC_NUMBER,
        video_view_time: DT.METRIC_NUMBER,
        video_avg_time_watched: DT.METRIC_NUMBER,
        reaction_like: DT.METRIC_NUMBER,
        reaction_love: DT.METRIC_NUMBER,
        reaction_wow: DT.METRIC_NUMBER,
        reaction_haha: DT.METRIC_NUMBER,
        reaction_sorry: DT.METRIC_NUMBER,
        reaction_anger: DT.METRIC_NUMBER,
        engagement_comments: DT.METRIC_NUMBER,
        engagement_shares: DT.METRIC_NUMBER,
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
      darkPost: false,
      published: true,
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
      console.log('PAAAAAAAAAAAAAGE', pageId);
      if (pageId) {
        params.page_id = pageId;
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
})(FacebookPost || {});
