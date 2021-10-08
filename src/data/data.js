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

  // https://developers.google.com/datastudio/connector/reference#getdata
  api.getData = function getData(request) {
    console.log(request);
    request.configParams = Config.validate(request.configParams);

    var schema = {};
    var data = [];
    try {
      var content = null;
      var node = request.configParams.node;
      if (node === 'facebook_post') {
        content = FacebookPost.findAll(request);
      } else {
        throw new Error('Node type not handled !');
      }

      schema = Schema.getSchemaFromContent(content, request);
      data = Data.format(content, request.fields);
    } catch (e) {
      CONNECTOR.newUserError()
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
