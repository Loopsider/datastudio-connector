(function () {
  'use strict';
})();

var TiktokVideo = (function (api) {
  var endpoint;
  var fields;

  api._init = function _init() {
    endpoint = '/tiktok/videos';
    fields = {
      id: DT.DIMENSION_NUMBER,
      network_id: DT.STRING,
      created_time: DT.DATETIME,
      description: DT.STRING,
      video_id: DT.DIMENSION_NUMBER,
      video_cover_link: DT.URL,
      video_file_link: DT.URL,
      duration: DT.DIMENSION_NUMBER,
      original_item: DT.BOOLEAN,
      offical_item: DT.BOOLEAN,
      secret: DT.BOOLEAN,
      for_friend: DT.BOOLEAN,
      digged: DT.BOOLEAN,
      item_comment_status: DT.DIMENSION_NUMBER,
      show_not_pass: DT.BOOLEAN,
      vl1: DT.BOOLEAN,
      item_mute: DT.BOOLEAN,
      private_item: DT.BOOLEAN,
      duet_enabled: DT.BOOLEAN,
      stitch_enabled: DT.BOOLEAN,
      share_enabled: DT.BOOLEAN,
      is_ad: DT.BOOLEAN,
      duet_display: DT.DIMENSION_NUMBER,
      stitch_display: DT.DIMENSION_NUMBER,
      author: {
        id: DT.DIMENSION_NUMBER,
        network_id: DT.STRING,
        unique_id: DT.STRING,
        nickname: DT.STRING,
        avatar_thumb: DT.URL,
        avatar_medium: DT.URL,
        avatar_larger: DT.URL,
        signature: DT.STRING,
        verified: DT.BOOLEAN,
        sec_uid: DT.STRING,
        secret: DT.BOOLEAN,
        ftc: DT.BOOLEAN,
        relation: DT.BOOLEAN,
        open_favorite: DT.BOOLEAN,
        comment_setting: DT.DIMENSION_NUMBER,
        duet_setting: DT.DIMENSION_NUMBER,
        stitch_setting: DT.DIMENSION_NUMBER,
        private_account: DT.BOOLEAN,
        is_ad_virtual: DT.BOOLEAN,
      },
      insight: {
        id: DT.DIMENSION_NUMBER,
        date: DT.DATETIME,
        digg_count: DT.METRIC_NUMBER,
        share_count: DT.METRIC_NUMBER,
        comment_count: DT.METRIC_NUMBER,
        play_count: DT.METRIC_NUMBER,
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
      /* OTHER AVAILABLE PARAMS */
      // author_id
      // ids
      // search
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
})(TiktokVideo || {});
