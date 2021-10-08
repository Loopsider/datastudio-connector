(function () {
  'use strict';
})();

var Model = (function (api) {
  /**
   * Helper function to transform an object into a query string
   *
   * @param   {[type]}  queryObject  [queryObject description]
   *
   * @return  {[type]}               [return description]
   */
  api.toQueryString = function toQueryString(queryObject) {
    var queryString = '';
    for (var key in queryObject) {
      var value = queryObject[key];
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    }
    if (queryString.length > 0) {
      queryString = queryString.substring(0, queryString.length - 1); //chop off last "&"
      queryString = '?' + queryString;
    }

    return queryString;
  };

  api.getFieldsString = function getFieldsString(fieldsDefinition, requestedFields) {
    if (requestedFields) {
      // clean fieldsDefinition
      var fieldNames = requestedFields.map(function (requestedField) {
        return requestedField.name;
      });
      fieldsDefinition = Model.findMinimumDefinitionFromRequest(fieldsDefinition, fieldNames);
    }

    var fields = Model.getFieldsStringRecursive(fieldsDefinition);

    return fields;
  };

  api.findMinimumDefinitionFromRequest = function findMinimumDefinitionFromRequest(fieldsDefinition, names) {
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

  api.getFieldsStringRecursive = function getFieldsStringRecursive(fieldsDefinition) {
    var fieldsString = '';
    Object.keys(fieldsDefinition).map(function (fieldName) {
      if (typeof fieldsDefinition[fieldName] === 'object' && fieldsDefinition[fieldName] !== null) {
        fieldsString += fieldName + '{' + Model.getFieldsStringRecursive(fieldsDefinition[fieldName]) + '},';
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
})(Model || {});
