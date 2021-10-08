(function () {
  'use strict';
})();

var Schema = (function (api) {
  getFields = function getFields(row) {
    var fields = CONNECTOR.getFields();
    var types = CONNECTOR.FieldType;

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

  api.getSchemaFromContent = function getSchemaFromContent(content, request) {
    var requestedFieldIds = request.fields.map(function (field) {
      return field.name;
    });

    var schema = getFields(content[0]).forIds(requestedFieldIds).build();

    return schema;
  };

  // https://developers.google.com/datastudio/connector/reference#getschema
  api.getSchema = function getSchema(request) {
    console.log(request);
    request.configParams = Config.validate(request.configParams);

    var node = request.configParams.node;
    var content = null;
    if (node === 'facebook_post') {
      content = FacebookPost.findAll(request, {limit: 1});
    } else {
      throw new Error('Node type not handled !');
    }

    if (!content || !content.length) {
      console.log('Error in getFields - Cannot retrieve data');
      console.log(content);
      throw new Error('Error in getFields - Cannot retrieve data');
    }

    // We only need first row for schema definition
    var firstRow = content[0];
    var schema = getFields(firstRow).build();

    return schema;
  };

  return api;
})(Schema || {});
