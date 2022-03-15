(function () {
  'use strict';
})();

/**
 * List of available types
 * @link https://developers.google.com/apps-script/reference/data-studio/field-type
 */

var DT = (function (api) {
  api._init = function _init() {
    /********************/
    /*** NUMBER TYPES ***/
    /********************/
    api.DIMENSION_NUMBER = {
      _isDataType: true,
      type: 'NUMBER',
      semantics: {
        conceptType: 'DIMENSION',
      },
    };

    api.METRIC_NUMBER = {
      _isDataType: true,
      type: 'NUMBER',
      semantics: {
        conceptType: 'METRIC',
        isReaggregatable: true,
      },
    };

    api.METRIC_NUMBER_PERCENT = {
      _isDataType: true,
      type: 'NUMBER',
      semantics: {
        conceptType: 'METRIC',
        isReaggregatable: true,
        semanticType: 'PERCENT',
      },
    };

    /********************/
    /*** STRING TYPES ***/
    /********************/
    api.STRING = {
      _isDataType: true,
      type: 'STRING',
      semantics: {
        conceptType: 'DIMENSION',
      },
    };

    api.URL = {
      _isDataType: true,
      type: 'STRING',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'URL',
      },
    };

    api.DATETIME = {
      _isDataType: true,
      type: 'STRING',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_MONTH_DAY_SECOND',
      },
      prepare: function (value) {
        var date = new Date(value);
        var formatted = date
          .toISOString()
          .replaceAll(/[^0-9]+/g, '')
          .slice(0, -3);
        return formatted;
      },
    };

    /*******************/
    /*** OTHER TYPES ***/
    /*******************/
    api.BOOLEAN = {
      _isDataType: true,
      type: 'BOOLEAN',
      semantics: {
        conceptType: 'DIMENSION',
      },
    };
  };

  return api;
})(DT || {});
