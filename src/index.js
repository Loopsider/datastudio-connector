var CONNECTOR = DataStudioApp.createCommunityConnector();

function init() {
  DT._init();

  FacebookPost._init();
  InstagramMedia._init();
}

function getAuthType() {
  init();
  return Auth.getAuthType();
}

function isAdminUser() {
  init();
  return Auth.isAdminUser();
}

function getConfig(request) {
  init();
  return Config.getConfig(request);
}

function getSchema(request) {
  init();
  return Data.getSchema(request);
}

function getData(request) {
  init();
  return Data.getData(request);
}
