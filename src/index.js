function getAuthType() {
  return Auth.getAuthType();
}

function isAdminUser() {
  return Auth.isAdminUser();
}

function getConfig() {
  return Config.getConfig();
}

function getSchema(request) {
  return Schema.getSchema(request);
}

function getData(request) {
  return Data.getData(request);
}
