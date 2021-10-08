(function () {
  'use strict';
})();

var Config = (function (api) {
  // https://developers.google.com/datastudio/connector/reference#getconfig
  api.getConfig = function getConfig() {
    var conf = CONNECTOR.getConfig();

    conf.newInfo().setId('instructions').setText('Bonjour');

    conf
      .newSelectSingle()
      .setId('node')
      .setName('Type de données')
      .setHelpText('De quel type de données avez vous besoin')
      .setAllowOverride(false)
      .addOption(conf.newOptionBuilder().setLabel('Facebook Posts (données privées)').setValue('facebook_post'))
      .addOption(conf.newOptionBuilder().setLabel('Facebook Posts (données marché)').setValue('crowdtangle_facebook'))
      .addOption(conf.newOptionBuilder().setLabel('Instagram Media').setValue('instagram_media'));

    conf.newInfo().setId('Help').setText("Demander de l'aide à l'équipe tech");

    conf
      .newTextInput()
      .setId('token')
      .setName('Loopsider API access token')
      .setHelpText("Demander ce token a l'équipe technique")
      .setPlaceholder('')
      .setAllowOverride(false);

    conf.setDateRangeRequired(false);

    return conf.build();
  };

  /**
   * Validates config parameters and provides missing values.
   *
   * @param {Object} configParams Config parameters from `request`.
   * @returns {Object} Updated Config parameters.
   */
  api.validate = function validate(configParams) {
    configParams = configParams || {};
    // TODO run validations
    return configParams;
  };

  return api;
})(Config || {});
