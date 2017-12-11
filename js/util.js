'use strict';

(function () {
  var getRandomNumber = function (max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min) + min);
  };

  var getRandomElement = function (arr) {
    return arr[getRandomNumber(arr.length)];
  };

  var getUniqueRandomElement = function (arr) {
    return arr.splice(getRandomNumber(arr.length), 1).join('');
  };

  var getRandomizedArray = function (source, length) {
    length = length || source.length;
    var arr = source.slice();
    var result = [];
    while (length-- > 0) {
      if (!arr.length) {
        arr = source.slice();
      }
      result.push(getUniqueRandomElement(arr));
    }
    return result;
  };

  var getFragment = function (data, renderMethod) {
    data = Array.isArray(data) ? data : [data];
    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      fragment.appendChild(renderMethod(item));
    });
    return fragment;
  };
  var setListeners = function (element, action, events, handlers) {
    if (action === 'add') {
      events.forEach(function (event, index) {
        element.addEventListener(event, handlers[index]);
      });
    }
    if (action === 'remove') {
      events.forEach(function (event, index) {
        element.removeEventListener(event, handlers[index]);
      });
    }
  };
  var getClickHandler = function (method) {
    return function (evt) {
      method(evt);
    };
  };
  var getKeydownHandler = function (keyCode, method) {
    return function (evt) {
      if (evt.keyCode === keyCode) {
        method(evt);
      }
    };
  };
  var getProperties = function (str) {
    var result = {};
    var properties = str.split(';');
    properties.forEach(function (value) {
      if (value) {
        var propertyInfo = value.split(':');
        result[propertyInfo[0].trim()] = propertyInfo[1].trim();
      }
    });
    return result;
  };
  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getUniqueRandomElement: getUniqueRandomElement,
    getRandomizedArray: getRandomizedArray,
    getFragment: getFragment,
    setListeners: setListeners,
    getClickHandler: getClickHandler,
    getKeydownHandler: getKeydownHandler,
    getProperties: getProperties
  };
})();
