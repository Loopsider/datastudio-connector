(function () {
  'use strict';
})();

var FacebookPost = (function (api) {
  if (!api) {
    api = Model;
  }

  var endpoint = '/facebook/posts';
  var fields = {
    id: true,
    message: true,
    created_time: true,
    sponsor: {
      picture_file: true,
      name: true,
      network_id: true,
    },
    permalink_url: true,
    ads: true,
    category: true,
    categorization_is_corrected: true,
    page: {
      id: true,
      name: true,
      picture_file: true,
      is_pilot_page: true,
      picture: true,
    },
    attachment: {
      thumbnail: true,
      storage_thumbnail: true,
      type: true,
      source: true,
      title: true,
      url: true,
      storage_file: true,
      screenshot_0: true,
      screenshot_3: true,
      screenshot_6: true,
      screenshot_10: true,
    },
    insight_video: {
      length_lifetime: true,
      views_lifetime: true,
      views_10s_lifetime: true,
      views_30s_lifetime: true,
      views_15s_computed: true,
      views_60s_computed: true,
      retention_graph_json: true,
      view_time_region_lifetime: true,
      age_gender_json: true,
      avg_time_watched_lifetime: true,
      view_time_lifetime: true,
      complete_views_organic_lifetime: true,
      complete_views_paid_lifetime: true,
      ad_break_ad_impressions_lifetime: true,
      ad_break_earnings_lifetime: true,
      ad_break_ad_cpm_lifetime: true,
    },
    insight_engagement: {
      engaged_users_lifetime: true,
      clicks_lifetime: true,
      comments: true,
      shares: true,
    },
    insight_impression: {
      total_lifetime: true,
      viral_lifetime: true,
      nonviral_lifetime: true,
      fan_lifetime: true,
    },
    insight_reaction: {
      like_total_lifetime: true,
      love_total_lifetime: true,
      wow_total_lifetime: true,
      haha_total_lifetime: true,
      sorry_total_lifetime: true,
      anger_total_lifetime: true,
    },
    insight_score: {
      score_retention: true,
      score_interaction: true,
      score_captation: true,
      score_captation_6s: true,
      score_captation_10s: true,
      score_distribution: true,
    },
    insight_benchmark: {
      video_views: true,
      video_views_10s: true,
      video_views_30s: true,
      video_views_60s: true,
      video_view_time: true,
      video_avg_time_watched: true,
      reaction_like: true,
      reaction_love: true,
      reaction_wow: true,
      reaction_haha: true,
      reaction_sorry: true,
      reaction_anger: true,
      engagement_comments: true,
      engagement_shares: true,
      average_retention_graph_json: true,
    },
    boost: {
      status: true,
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
})(FacebookPost || {});
