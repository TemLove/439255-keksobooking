'use strict';

(function () {
  window.synchronizeFields = function (firstField, secondField, firstFieldValues, secondFieldValues, callback) {
    var i = firstFieldValues.indexOf(window.util.findSelectedOption(firstField).value);
    callback(secondField, secondFieldValues[i]);
  };
})();
