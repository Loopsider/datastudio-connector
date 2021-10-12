(function () {
  'use strict';
})();

var InstagramMedia = (function (api) {
  if (!api) {
    api = Model;
  }

  var endpoint = '/instagram/medias';
  var fields = {
    id: true,
    caption: true,
    title: true,
    created_time: true,
    media_type: true,
    permalink: true,
    media_url: true,
    thumbnail_url: true,
    post_type: true,
    storage_file: true,
    storage_thumbnail: true,
    screenshot_0: true,
    screenshot_3: true,
    screenshot_10: true,
    screenshot_15: true,
    sponsor_name: true,
    sponsor_id: true,
    account: {
      name: true,
      id: true,
      profile_picture_url: true,
      picture_file: true,
    },
    score: {
      distribution_views: true,
      distribution_impressions: true,
      distribution_reach: true,
      distribution_likes: true,
      distribution_comments: true,
      distribution_saved: true,
      distribution_unfollow: true,
      score_distribution: true,
      score_retention: true,
      score_captation: true,
      score_captation_10s: true,
      score_captation_15s: true,
    },
    insight: {
      likes: true,
      comments: true,
      engagement_lifetime: true,
      impressions_lifetime: true,
      reach_lifetime: true,
      retention_graph_json: true,
      saved_lifetime: true,
      video_views_lifetime: true,
      profile_views: true,
      profile_action_bio_link_clicked: true,
      profile_action_call: true,
      profile_action_direction: true,
      profile_action_email: true,
      profile_action_text: true,
      account_follows: true,
      reach_non_follower: true,
      impressions_from_feed: true,
      impressions_from_explore: true,
      impressions_from_hashtags: true,
      impressions_from_profile: true,
      impressions_from_others: true,
      length_lifetime: true,
      views_10s_computed: true,
      views_15s_computed: true,
    },
    insight_benchmark: {
      comments: true,
      likes: true,
      saved: true,
      reach: true,
      video_views: true,
      score_distribution: true,
      average_retention_graph_json: true,
    },
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

    return content ? content.data : null;
  };

  return api;
})(InstagramMedia || {});
