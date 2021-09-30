var cc = DataStudioApp.createCommunityConnector();
var DEFAULT_PACKAGE = 'googleapis';

// https://developers.google.com/datastudio/connector/reference#getauthtype
function getAuthType() {
  var AuthTypes = cc.AuthType;
  return cc.newAuthTypeResponse().setAuthType(AuthTypes.NONE).build();
}
