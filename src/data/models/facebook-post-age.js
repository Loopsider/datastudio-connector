(function () {
  'use strict';
})();

var FacebookPostAge = (function (api) {
  if (!api) {
    api = Model;
  }

  var endpoint;
  var translations = {};

  api._init = function _init() {
    endpoint = '/facebook/posts';
    translations = {
      male: 'Masculin',
      female: 'Féminin',
      undefined: 'Indéfini',
      '13_17': '13-17',
      '18_24': '18-24',
      '25_34': '25-34',
      '35_44': '35-44',
      '45_54': '45-54',
      '55_64': '55-64',
      '65_plus': '65+',
    };
  };

  function prepareData(data) {
    var preparedData = [];
    data.map(function (post) {
      if (post.insight_video_age_gender_json) {
        var bucketData = post.insight_video_age_gender_json;
        delete post.insight_video_age_gender_json; // delete this so it won't be cloned

        if (bucketData.id) {
          delete bucketData.id;
        }
        Object.keys(bucketData).map(function (bucketName) {
          var row = JSON.parse(JSON.stringify(post)); // clone post data
          row.bucket = bucketName; // eg. female_25_34
          row.gender = translations[bucketName.split('_')[0]]; // eg. female
          row.age = translations[bucketName.substring(bucketName.indexOf('_') + 1)]; // eg.24_34
          row.value = bucketData[bucketName];

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
      console.log('DIMONSION', request.dimensionsFilters);
      var nodeId = FiltersHelper.getNodeId(request.dimensionsFilters);
      console.log('NODEID', nodeId);
      params.ids = nodeId;
    }

    if (overrideParams) {
      params = {...params, ...overrideParams};
    }

    var content = API.fetchData(endpoint, params, request.configParams.token);
    console.log('FETCHED CONTENT', content);

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
      bucket: {
        name: 'bucket',
        label: 'bucket',
        dataType: DT.STRING.type,
        semantics: DT.STRING.semantics,
      },
      age: {
        name: 'age',
        label: 'age',
        dataType: DT.STRING.type,
        semantics: DT.STRING.semantics,
      },
      gender: {
        name: 'gender',
        label: 'gender',
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
})(FacebookPostAge || {});
