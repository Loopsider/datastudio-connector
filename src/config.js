(function () {
  'use strict';
})();

var Config = (function (api) {
  // https://developers.google.com/datastudio/connector/reference#getconfig
  api.getConfig = function getConfig(request) {
    var configParams = request ? request.configParams : null;

    var form = CONNECTOR.getConfig();
    form.setIsSteppedConfig(true);

    form
      .newInfo()
      .setId('version')
      .setText('Version du connecteur : ' + CONNECTOR_VERSION);
    form.newInfo().setId('instructions').setText("Configurer l'authentification à l'API loopsider");

    form
      .newTextInput()
      .setId('token')
      .setName('Loopsider API access token')
      .setHelpText("Demander ce token à l'équipe technique")
      .setPlaceholder('')
      .setAllowOverride(false);

    form.newInfo().setId('Help').setText('Configurer le connecteur');

    form.setDateRangeRequired(true);
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
      .addOption(form.newOptionBuilder().setLabel('Instagram Media (données privées)').setValue('instagram_media'))
      .addOption(form.newOptionBuilder().setLabel('Tiktok Video (données publiques)').setValue('tiktok_video'));

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
          // may be available in the future :
          //.addOption(form.newOptionBuilder().setLabel('Données quotidiennes').setValue('daily'));
          break;
        }
        case 'instagram_media': {
          nodeOption.addOption(form.newOptionBuilder().setLabel('Aucune').setValue('none'));
          // may be available in the future :
          //.addOption(form.newOptionBuilder().setLabel('Données quotidiennes').setValue('daily'));
          break;
        }
        case 'tiktok_video': {
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
      if (nodeOption === 'daily') {
        return FacebookPostDaily;
      }
      return FacebookPost;
    } else if (node === 'instagram_media') {
      if (nodeOption === 'daily') {
        return InstagramMediaDaily;
      }
      return InstagramMedia;
    } else if (node === 'tiktok_video') {
      return TiktokVideo;
    }

    throw new Error('Node type not handled !');
  };

  return api;
})(Config || {});
