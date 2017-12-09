'use strict';

(function () {
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
    getFragment: getFragment,
    setListeners: setListeners,
    getClickHandler: getClickHandler,
    getKeydownHandler: getKeydownHandler,
    getProperties: getProperties
  };
})();
