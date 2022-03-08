var CONNECTOR = DataStudioApp.createCommunityConnector();

function init() {
  DT._init();

  FacebookPost._init();
  FacebookPostAge._init();
  FacebookPostDaily._init();
  InstagramMedia._init();
  TiktokVideo._init();
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
  console.log(request);
  init();
  return Config.getConfig(request);
}

function getSchema(request) {
  console.log(request);
  init();
  return Data.getSchema(request);
}

function getData(request) {
  console.log(request);
  init();
  return Data.getData(request);
}
