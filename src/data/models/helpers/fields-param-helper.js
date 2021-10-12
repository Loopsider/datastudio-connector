(function () {
  'use strict';
})();

var FieldsParamHelper = (function (api) {
  /**
   * Helper function (recursive) to write a string from a given `field` Object
   *
   * @param   {Object}  fieldsDefinition
   * @return  {String}
   */
  buildString = function buildString(fieldsDefinition) {
    var fieldsString = '';
    Object.keys(fieldsDefinition).map(function (fieldName) {
      if (typeof fieldsDefinition[fieldName] === 'object' && fieldsDefinition[fieldName] !== null) {
        fieldsString += fieldName + '{' + buildString(fieldsDefinition[fieldName]) + '},';
      } else {
        fieldsString += fieldName + ',';
      }
    });
    if (fieldsString.length > 0) {
      fieldsString = fieldsString.substring(0, fieldsString.length - 1); //chop off last ","
    }

    return fieldsString;
  };

  /**
   * Helper function (recursive) to remove unnecessary fields from given field Object requested field names
   *
   * @param   {Object}  fieldsDefinition  `field` from Model
   * @param   {Array}   names             list of valid field names
   * @return  {Object}
   */
  findMinimumDefinition = function findMinimumDefinition(fieldsDefinition, names) {
    var updatedDefinition = {};
    names.map(function (name) {
      var suffix = '';
      var found = false;
      while (!found) {
        if (Object.keys(fieldsDefinition).includes(name)) {
          found = true;
          var value = true;
          if (suffix !== '') {
            value = findMinimumDefinition(fieldsDefinition[name], [suffix]);
          }

          updatedDefinition[name] = value;
        } else {
          var lastUnderscore = name.lastIndexOf('_');
          if (lastUnderscore === -1) {
            console.log('ERROR');
            break;
          }
          if (suffix !== '') {
            suffix = name.substr(lastUnderscore + 1) + '_' + suffix;
          } else {
            suffix = name.substr(lastUnderscore + 1);
          }

          name = name.substr(0, lastUnderscore);
        }
      }
    });
    return updatedDefinition;
  };

  /**
   * Build a string from `field` object with only requested parts if `requestedFields` is given
   *
   * @param   {Object}        fieldsDefinition  `fields` Object from model
   * @param   {Object|null}   requestedFields   `request.fields` from request Object. If null, get ALL fields.
   * @return  {String}
   */
  api.getFieldsString = function getFieldsString(fieldsDefinition, requestedFields = null) {
    if (requestedFields) {
      // clean fieldsDefinition
      var fieldNames = requestedFields.map(function (requestedField) {
        return requestedField.name;
      });
      fieldsDefinition = findMinimumDefinition(fieldsDefinition, fieldNames);
    }

    var fields = buildString(fieldsDefinition);

    return fields;
  };

  return api;
})(FieldsParamHelper || {});
