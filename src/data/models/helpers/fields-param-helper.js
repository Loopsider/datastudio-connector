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
  function getQueryParamString(fieldsDefinition) {
    var fieldsString = '';
    Object.keys(fieldsDefinition).map(function (fieldName) {
      if (!fieldsDefinition[fieldName]._isDataType) {
        fieldsString += fieldName + '{' + getQueryParamString(fieldsDefinition[fieldName]) + '},';
      } else {
        fieldsString += fieldName + ',';
      }
    });
    if (fieldsString.length > 0) {
      fieldsString = fieldsString.substring(0, fieldsString.length - 1); //chop off last ","
    }

    return fieldsString;
  }

  /**
   * Helper function (recursive) to remove unnecessary fields from given field Object requested field names
   *
   * @param   {Object}  fieldsDefinition  `field` from Model
   * @param   {Array}   names             list of valid field names
   * @return  {Object}
   */
  function reduceRecursive(fieldsDefinition, names) {
    var updatedDefinition = {};
    names.map(function (name) {
      var suffix = '';
      var found = false;
      while (!found) {
        if (Object.keys(fieldsDefinition).includes(name)) {
          found = true;
          var value;
          if (suffix !== '') {
            value = reduceRecursive(fieldsDefinition[name], [suffix]);
          } else {
            value = fieldsDefinition[name];
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
  }

  function reduce(fieldsDefinition, requestedFields = null) {
    if (requestedFields) {
      // clean fieldsDefinition
      var fieldNames = requestedFields.map(function (requestedField) {
        return requestedField.name;
      });
      fieldsDefinition = reduceRecursive(fieldsDefinition, fieldNames);
    }

    return fieldsDefinition;
  }

  function flattenRecursive(fieldsDefinition, prefix = '') {
    var flat = {};
    Object.keys(fieldsDefinition).map(function (fieldName) {
      if (!fieldsDefinition[fieldName]._isDataType) {
        flat = {...flat, ...flattenRecursive(fieldsDefinition[fieldName], fieldName + '_')};
      } else {
        flat[prefix + fieldName] = fieldsDefinition[fieldName];
      }
    });
    return flat;
  }

  function getFlattenArray(fieldsDefinition, requestedFields = null) {
    fieldsDefinition = reduce(fieldsDefinition, requestedFields);

    var flat = flattenRecursive(fieldsDefinition);
    return flat;
  }

  /**
   * Build a string from `field` object with only requested parts if `requestedFields` is given
   *
   * @param   {Object}        fieldsDefinition  `fields` Object from model
   * @param   {Object|null}   requestedFields   `request.fields` from request Object. If null, get ALL fields.
   * @return  {String}
   */
  function getFieldsString(fieldsDefinition, requestedFields = null) {
    fieldsDefinition = reduce(fieldsDefinition, requestedFields);
    var fields = getQueryParamString(fieldsDefinition);

    return fields;
  }

  api.getFlattenArray = getFlattenArray;
  api.getFieldsString = getFieldsString;

  return api;
})(FieldsParamHelper || {});
