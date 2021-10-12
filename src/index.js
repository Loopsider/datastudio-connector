var CONNECTOR = DataStudioApp.createCommunityConnector();

function getAuthType() {
  return Auth.getAuthType();
}

function isAdminUser() {
  return Auth.isAdminUser();
}

function getConfig(request) {
  return Config.getConfig(request);
}

function getSchema(request) {
  return {
    schema: Schema.getSchema(request),
  };
}

function getData(request) {
  return Data.getData(request);
}
