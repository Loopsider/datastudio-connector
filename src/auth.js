(function () {
  'use strict';
})();

var Auth = (function (api) {
  // https://developers.google.com/datastudio/connector/reference#getauthtype
  api.getAuthType = function getAuthType() {
    var cc = DataStudioApp.createCommunityConnector();
    var AuthTypes = cc.AuthType;
    return cc.newAuthTypeResponse().setAuthType(AuthTypes.NONE).build();
  };

  // https://developers.google.com/datastudio/connector/reference#isadminuser
  api.isAdminUser = function isAdminUser() {
    return true; // true in dev
  };

  return api;
})(Auth || {});
