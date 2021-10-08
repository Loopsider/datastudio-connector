(function () {
  'use strict';
})();

var Schema = (function (api) {
  api.buildParams = function buildParams(apiFields, nodeId) {
    // TODO use requestedFields (if given) to filter out useless apiFields

    var queryString = '';
    for (var key in apiFields) {
      var value = apiFields[key];
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    }
    if (queryString.length > 0) {
      queryString = queryString.substring(0, queryString.length - 1); //chop off last "&"
      queryString = '?' + queryString;
    }

    if (nodeId) {
      queryString += '&ids=' + nodeId;
    }

    return queryString;
  };

  api.getFields = function getFields(row, requestedFields) {
    var communityConnector = DataStudioApp.createCommunityConnector();
    var fields = communityConnector.getFields();
    var types = communityConnector.FieldType;

    Object.keys(row).forEach(function (key) {
      var fieldType = types.TEXT;
      if (!isNaN(row[key])) {
        fieldType = types.NUMBER;
      }

      var field = fields.newDimension().setType(fieldType);
      field.setId(key);
      field.setName(key);
    });

    return fields;
  };

  // https://developers.google.com/datastudio/connector/reference#getschema
  api.getSchema = function getSchema(request) {
    request.configParams = Config.validate(request.configParams);

    var node = request.configParams.node;
    var endpoint = null;
    if (node === 'facebook_post') {
      endpoint = API_HOST + SchemaTemplateFacebookPost.endpoint + Schema.buildParams(SchemaTemplateFacebookPost.getParams(request.fields));
    } else {
      throw new Error('Node type not handled !');
    }

    var content = API.fetchData(endpoint, request.configParams.token);

    if (!content.data || !content.data.length) {
      console.log('Error in getFields - Cannot retrieve data');
      console.log(content);
      throw new Error('Error in getFields - Cannot retrieve data');
    }

    // We only need first row for schema definition
    var firstRow = content.data[0];
    var fields = Schema.getFields(firstRow).build();

    return {schema: fields};
  };

  return api;
})(Schema || {});
