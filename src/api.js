(function () {
  'use strict';
})();

var API = (function (api) {
  /**
   * Helper function to transform an object into a query string
   *
   * @param   {Object}  queryObject  Dict like object
   * @return  {String}               String like `?key=value&foo=bar
   */
  toQueryString = function toQueryString(params) {
    var queryString = '';
    for (var key in params) {
      var value = params[key];
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    }
    if (queryString.length > 0) {
      queryString = queryString.substring(0, queryString.length - 1); //chop off last "&"
      queryString = '?' + queryString;
    }

    return queryString;
  };

  /**
   * Call loopsider API (GET)
   *
   * @param {String} endpoint API endpoint
   * @param {Object} params   Request parameters.
   * @param {String} token    Access token
   * @returns {Object}        Response text for UrlFetchApp.
   */
  api.fetchData = function fetchData(endpoint, params, token) {
    var queryString = toQueryString(params);
    console.log(queryString);

    var options = {
      crossDomain: true,
      method: 'get',
      headers: {
        Accept: '*/*',
        Authorization: token,
      },
    };
    var response = UrlFetchApp.fetch(API_HOST + endpoint + queryString, options);
    var result = JSON.parse(response);

    return result;
  };

  return api;
})(API || {});
