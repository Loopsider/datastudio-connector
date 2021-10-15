(function () {
  'use strict';
})();

var Config = (function (api) {
  // https://developers.google.com/datastudio/connector/reference#getconfig
  api.getConfig = function getConfig(request) {
    console.log(request);
    var configParams = request ? request.configParams : null;

    var form = CONNECTOR.getConfig();
    form.setIsSteppedConfig(true);

    form.newInfo().setId('instructions').setText("Configurer l'authentification à l'API loopsider");

    form
      .newTextInput()
      .setId('token')
      .setName('Loopsider API access token')
      .setHelpText("Demander ce token a l'équipe technique")
      .setPlaceholder('')
      .setAllowOverride(false);

    form.newInfo().setId('Help').setText('Configurer le connecteur');

    form.setDateRangeRequired(false);
    form
      .newSelectSingle()
      .setId('node')
      .setName('Type de données')
      .setHelpText('De quel type de données avez vous besoin')
      // Set isDynamic to true so any changes to node will clear the nodeOption selections.
      .setIsDynamic(true)

      .setAllowOverride(false)
      .addOption(form.newOptionBuilder().setLabel('Facebook Posts (données privées)').setValue('facebook_post'))
      //.addOption(conf.newOptionBuilder().setLabel('Facebook Posts (données marché)').setValue('crowdtangle_facebook'))
      .addOption(form.newOptionBuilder().setLabel('Instagram Media (données privées)').setValue('instagram_media'));

    if (configParams) {
      if (configParams.node === undefined) {
        cc.newUserError().setText('Selectionner un type de données').throwException();
      }
      var nodeOption = form.newSelectSingle().setId('nodeOption').setName("Type d'aggrégation").setAllowOverride(false);

      switch (configParams.node) {
        case 'facebook_post': {
          nodeOption
            .addOption(form.newOptionBuilder().setLabel('Aucune').setValue('none'))
            .addOption(form.newOptionBuilder().setLabel('Audience par région').setValue('region'))
            .addOption(form.newOptionBuilder().setLabel('Audience par âge').setValue('age'));
          break;
        }
        case 'instagram_media': {
          nodeOption.addOption(form.newOptionBuilder().setLabel('Aucune').setValue('none'));
          break;
        }
        default: {
          cc.newUserError().setText("Le type de données sélectionné n'est pas valide").throwException();
        }
      }

      // all steps have been completed
      form.setIsSteppedConfig(false);
    }

    return form.build();
  };

  /**
   *
   *
   * @param {Object} configParams Config parameters from `request`.
   * @returns {Object} Updated Config parameters.
   */
  api.getModel = function getModel(configParams) {
    var node = configParams.node;
    var nodeOption = configParams.nodeOption;

    if (node === 'facebook_post') {
      if (nodeOption === 'region') {
        return FacebookPostRegion;
      }
      if (nodeOption === 'age') {
        return FacebookPostAge;
      }
      return FacebookPost;
    } else if (node === 'instagram_media') {
      return InstagramMedia;
    }

    throw new Error('Node type not handled !');
  };

  return api;
})(Config || {});
