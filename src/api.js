(function () {
  'use strict';
})();

var API = (function (api) {
  /**
   * Gets response for UrlFetchApp.
   *
   * @param {Object} request Data request parameters.
   * @returns {string} Response text for UrlFetchApp.
   */
  api.fetchData = function fetchData(endpoint, token) {
    var options = {
      crossDomain: true,
      method: 'get',
      headers: {
        Accept: '*/*',
        Authorization: token,
      },
    };
    var response = UrlFetchApp.fetch(endpoint, options);
    //console.log(response.getContentText());
    var result = JSON.parse(response);

    return result;
  };

  return api;
})(API || {});
