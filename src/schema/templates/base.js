(function () {
  'use strict';
})();

var SchemaTemplateBase = (function (api) {
  api.getFieldsString = function getFieldsString(fieldsDefinition, requestedFields) {
    console.log('getFieldsString');
    console.log(requestedFields);
    if (requestedFields) {
      console.log('INSIDE');
      // clean fieldsDefinition
      var fieldNames = requestedFields.map(function (requestedField) {
        return requestedField.name;
      });
      fieldsDefinition = SchemaTemplateBase.findMinimumDefinitionFromRequest(fieldsDefinition, fieldNames);
      console.log(fieldsDefinition);
    }

    var fields = SchemaTemplateBase.getFieldsStringRecursive(fieldsDefinition);

    return fields;
  };

  api.findMinimumDefinitionFromRequest = function findMinimumDefinitionFromRequest(fieldsDefinition, names) {
    console.log('findMinimumDefinitionFromRequest 001', fieldsDefinition, names);
    var updatedDefinition = {};
    names.map(function (name) {
      var suffix = '';
      var found = false;
      while (!found) {
        if (Object.keys(fieldsDefinition).includes(name)) {
          found = true;
          var value = true;
          if (suffix !== '') {
            value = findMinimumDefinitionFromRequest(fieldsDefinition[name], [suffix]);
          }
          console.log('findMinimumDefinitionFromRequest 002', name, value);

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
          console.log('findMinimumDefinitionFromRequest 003', name, suffix, lastUnderscore);
        }
      }
    });
    return updatedDefinition;
  };

  api.getFieldsStringRecursive = function getFieldsStringRecursive(fieldsDefinition) {
    var fieldsString = '';
    Object.keys(fieldsDefinition).map(function (fieldName) {
      if (typeof fieldsDefinition[fieldName] === 'object' && fieldsDefinition[fieldName] !== null) {
        fieldsString += fieldName + '{' + SchemaTemplateBase.getFieldsStringRecursive(fieldsDefinition[fieldName]) + '},';
      } else {
        fieldsString += fieldName + ',';
      }
    });
    if (fieldsString.length > 0) {
      fieldsString = fieldsString.substring(0, fieldsString.length - 1); //chop off last ","
    }

    return fieldsString;
  };

  return api;
})(SchemaTemplateBase || {});
