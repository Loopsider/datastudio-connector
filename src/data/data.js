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
  formatData = function formatData(rawData, requestedFields) {
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

  // https://developers.google.com/datastudio/connector/reference#getdata
  api.getData = function getData(request) {
    console.log(request);
    var model = Config.getModel(request.configParams);

    var schema = {};
    var data = [];
    try {
      schema = model.schema(request);

      var content = model.findAll(request);
      data = formatData(content, request.fields);
    } catch (e) {
      CONNECTOR.newUserError()
        .setDebugText('Error fetching data from API. Exception details: ' + e)
        .setText('The connector has encountered an unrecoverable error. Please try again later, or file an issue if this error persists.')
        .throwException();
    }

    console.log('SCHEMA', schema);
    console.log('DATA', data);

    return {
      schema: schema,
      rows: data,
    };
  };

  // https://developers.google.com/datastudio/connector/reference#getschema
  api.getSchema = function getSchema(request) {
    console.log(request);
    var model = Config.getModel(request.configParams);
    var schema = model.schema(request);

    return {
      schema: schema,
    };
  };

  return api;
})(Data || {});
