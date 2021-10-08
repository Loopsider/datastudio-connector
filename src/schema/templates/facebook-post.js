(function () {
  'use strict';
})();

var SchemaTemplateFacebookPost = (function (api) {
  api.fields = {
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

  api.endpoint = '/facebook/posts';

  api.getParams = function getParams(requestedFields = null) {
    return {
      fields: SchemaTemplateBase.getFieldsString(SchemaTemplateFacebookPost.fields, requestedFields),
      darkPost: false,
      published: true,
    };
  };

  return api;
})(SchemaTemplateFacebookPost || {});
