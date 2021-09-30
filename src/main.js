var cc = DataStudioApp.createCommunityConnector();
var DEFAULT_PACKAGE = 'googleapis';

/**
 * Gets response for UrlFetchApp.
 *
 * @param {Object} request Data request parameters.
 * @returns {string} Response text for UrlFetchApp.
 */
function fetchDataFromApi(request) {
  var options = {
    crossDomain: true,
    method: 'get',
    headers: {
      Accept: '*/*',
      Authorization: request.configParams.token,
    },
  };
  var url = 'https://api.loopsider.com/facebook/posts/insights?start=2009-01-01&end=2021-09-29&ids=4347857&dimension=daily';
  var response = UrlFetchApp.fetch(url, options);
  //console.log(response.getContentText());
  var result = JSON.parse(response);

  return result;
}

function getFields(content) {
  var communityConnector = DataStudioApp.createCommunityConnector();
  var fields = communityConnector.getFields();
  var types = communityConnector.FieldType;

  if (!content.data || !content.data.length) {
    console.log('Error in getFields - Cannot retrieve data');
    console.log(content);
    throw new Error('Error in getFields - Cannot retrieve data');
  }

  var firstRow = content.data[0];

  Object.keys(firstRow).forEach(function (key) {
    var fieldType = types.TEXT;
    if (!isNaN(firstRow[key])) {
      console.log('not nan');
      fieldType = types.NUMBER;
    } else {
      console.log(key);
      console.log('nan');
    }

    var field = fields.newDimension().setType(fieldType);
    field.setId(key);
    field.setName(key);
  });

  return fields;
}

// https://developers.google.com/datastudio/connector/reference#getschema
function getSchema(request) {
  var content = fetchDataFromApi(request);
  var fields = getFields(content).build();
  return {schema: fields};
}

// https://developers.google.com/datastudio/connector/reference#getdata
function getData(request) {
  request.configParams = validateConfig(request.configParams);

  try {
    var content = fetchDataFromApi(request);
    var data = formatData(content.data);
  } catch (e) {
    cc.newUserError()
      .setDebugText('Error fetching data from API. Exception details: ' + e)
      .setText('The connector has encountered an unrecoverable error. Please try again later, or file an issue if this error persists.')
      .throwException();
  }

  return {
    schema: getFields(content).build(),
    rows: data,
  };
}

// https://developers.google.com/datastudio/connector/reference#isadminuser
function isAdminUser() {
  return true; // true in dev
}

/**
 * Validates config parameters and provides missing values.
 *
 * @param {Object} configParams Config parameters from `request`.
 * @returns {Object} Updated Config parameters.
 */
function validateConfig(configParams) {
  configParams = configParams || {};
  // TODO run validations
  return configParams;
}

/**
 * Formats a single row of data into the required format.
 *
 * @param {Object} requestedFields Fields requested in the getData request.
 * @param {string} packageName Name of the package who's download data is being
 *    processed.
 * @param {Object} dailyDownload Contains the download data for a certain day.
 * @returns {Object} Contains values for requested fields in predefined format.
 */
function formatData(rawData) {
  var rows = rawData.map(function (rawRow) {
    return {
      values: Object.values(rawRow),
    };
  });
  return rows;
}
