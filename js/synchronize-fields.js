'use strict';

(function () {
  window.synchronizeFields = function (firstField, secondField, firstFieldValues, secondFieldValues, callback) {
    var i = firstFieldValues.indexOf(firstField.selectedOptions[0].value);
    callback(secondField, secondFieldValues[i]);
  };
})();
