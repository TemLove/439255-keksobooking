'use strict';

(function () {
  window.synchronizeFields = function (firstField, secondField, firstFieldValues, secondFieldValues, callback) {
    var i = firstFieldValues.indexOf(window.util.findSelectedOption(firstField).value);
    callback(secondField, secondFieldValues[i]);
    var fieldChangeHandler = function (evt) {
      var index = firstFieldValues.indexOf(evt.target.value);
      callback(secondField, secondFieldValues[index]);
    };
    firstField.addEventListener('change', fieldChangeHandler);
  };
})();
