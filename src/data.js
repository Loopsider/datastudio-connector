(function () {
  'use strict';
})();

var Data = (function (api) {
  /**
   * Formats a single row of data into the required format.
   *
   * @param {Object} requestedFields Fields requested in the getData request.
   * @param {string} packageName Name of the package who's download data is being
   *    processed.
   * @param {Object} dailyDownload Contains the download data for a certain day.
   * @returns {Object} Contains values for requested fields in predefined format.
   */
  api.format = function format(rawData, requestedFields) {
    var rows = rawData.map(function (rawRow) {
      var values = requestedFields.map(function (requestedField) {
        return rawRow[requestedField.name];
      });

      return {
        values: values,
      };
    });
    return rows;
  };

  api.getNodeIdFromFilters = function getNodeIdFromFilters(filters) {
    var orFilters = filters ? filters[0] : [];
    var nodeId = orFilters
      .map(function (filter) {
        if (filter.fieldName === 'id') {
          return filter.values.join(',');
        }
        return null;
      })
      .filter(function (filter) {
        return filter !== null;
      })
      .join(',');

    if (!nodeId) {
      var cc = DataStudioApp.createCommunityConnector();
      cc.newUserError()
        .setDebugText('Filter is not set correctly, current filters : ' + JSON.stringify(filters))
        .setText('A filter on field "id" is mandatory')
        .throwException();
    }

    return nodeId;
  };

  // https://developers.google.com/datastudio/connector/reference#getdata
  api.getData = function getData(request) {
    console.log(request);
    var cc = DataStudioApp.createCommunityConnector();
    request.configParams = Config.validate(request.configParams);

    var requestedFieldIds = request.fields.map(function (field) {
      return field.name;
    });

    var token = request.configParams.token;
    var node = request.configParams.node;
    var nodeId = Data.getNodeIdFromFilters(request.dimensionsFilters);

    var endpoint = null;
    if (node === 'facebook_post') {
      endpoint = API_HOST + SchemaTemplateFacebookPost.endpoint + Schema.buildParams(SchemaTemplateFacebookPost.getParams(request.fields), nodeId);
    } else {
      throw new Error('Node type not handled !');
    }

    try {
      var content = API.fetchData(endpoint, token);
      var schema = Schema.getFields(content.data[0]).forIds(requestedFieldIds).build();
      var data = Data.format(content.data, request.fields);
    } catch (e) {
      cc.newUserError()
        .setDebugText('Error fetching data from API. Exception details: ' + e)
        .setText('The connector has encountered an unrecoverable error. Please try again later, or file an issue if this error persists.')
        .throwException();
    }

    return {
      schema: schema,
      rows: data,
    };
  };
  return api;
})(Data || {});
