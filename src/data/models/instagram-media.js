(function () {
  'use strict';
})();

var InstagramMedia = (function (api) {
  var endpoint;
  var fields;

  api._init = function _init() {
    endpoint = '/instagram/medias';
    fields = {
      id: DT.DIMENSION_NUMBER,
      caption: DT.STRING,
      title: DT.STRING,
      created_time: DT.DATETIME,
      media_type: DT.STRING,
      permalink: DT.URL,
      media_url: DT.URL,
      thumbnail_url: DT.URL,
      post_type: DT.STRING,
      storage_file: DT.STRING,
      storage_thumbnail: DT.STRING,
      screenshot_0: DT.STRING,
      screenshot_3: DT.STRING,
      screenshot_10: DT.STRING,
      screenshot_15: DT.STRING,
      sponsor_name: DT.STRING,
      sponsor_id: DT.STRING,
      account: {
        name: DT.STRING,
        id: DT.DIMENSION_NUMBER,
        profile_picture_url: DT.STRING,
        picture_file: DT.STRING,
      },
      score: {
        distribution_views: DT.METRIC_NUMBER,
        distribution_impressions: DT.METRIC_NUMBER,
        distribution_reach: DT.METRIC_NUMBER,
        distribution_likes: DT.METRIC_NUMBER,
        distribution_comments: DT.METRIC_NUMBER,
        distribution_saved: DT.METRIC_NUMBER,
        distribution_unfollow: DT.METRIC_NUMBER,
        score_distribution: DT.METRIC_NUMBER,
        score_retention: DT.METRIC_NUMBER_PERCENT,
        score_captation: DT.METRIC_NUMBER_PERCENT,
        score_captation_10s: DT.METRIC_NUMBER_PERCENT,
        score_captation_15s: DT.METRIC_NUMBER_PERCENT,
      },
      insight: {
        likes: DT.METRIC_NUMBER,
        comments: DT.METRIC_NUMBER,
        engagement_lifetime: DT.METRIC_NUMBER,
        impressions_lifetime: DT.METRIC_NUMBER,
        reach_lifetime: DT.METRIC_NUMBER,
        saved_lifetime: DT.METRIC_NUMBER,
        video_views_lifetime: DT.METRIC_NUMBER,
        profile_views: DT.METRIC_NUMBER,
        profile_action_bio_link_clicked: DT.METRIC_NUMBER,
        profile_action_call: DT.METRIC_NUMBER,
        profile_action_direction: DT.METRIC_NUMBER,
        profile_action_email: DT.METRIC_NUMBER,
        profile_action_text: DT.METRIC_NUMBER,
        account_follows: DT.METRIC_NUMBER,
        reach_non_follower: DT.METRIC_NUMBER,
        impressions_from_feed: DT.METRIC_NUMBER,
        impressions_from_explore: DT.METRIC_NUMBER,
        impressions_from_hashtags: DT.METRIC_NUMBER,
        impressions_from_profile: DT.METRIC_NUMBER,
        impressions_from_others: DT.METRIC_NUMBER,
        length_lifetime: DT.METRIC_NUMBER,
        views_10s_computed: DT.METRIC_NUMBER,
        views_15s_computed: DT.METRIC_NUMBER,
      },
      insight_benchmark: {
        comments: DT.METRIC_NUMBER,
        likes: DT.METRIC_NUMBER,
        saved: DT.METRIC_NUMBER,
        reach: DT.METRIC_NUMBER,
        video_views: DT.METRIC_NUMBER,
        score_distribution: DT.METRIC_NUMBER_PERCENT,
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
      // urls
      // search
      // content_type
      // brandContent
      // categories
      // since
      // until
      // categorization_checked

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
})(InstagramMedia || {});
