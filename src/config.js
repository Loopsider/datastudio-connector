var cc = DataStudioApp.createCommunityConnector();

// [START get_config]
// https://developers.google.com/datastudio/connector/reference#getconfig
function getConfig() {
  var config = cc.getConfig();

  config.newInfo().setId('instructions').setText('Ceci est un test');

  config
    .newTextInput()
    .setId('token')
    .setName('Loopsider API access token')
    .setHelpText("Demander ce token a l'équipe technique")
    .setPlaceholder('')
    .setAllowOverride(false);

  config.setDateRangeRequired(true);

  return config.build();
}
// [END get_config]
