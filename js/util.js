'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

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

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
    element.placeholder = element.min;
  };

  var syncMultipleValues = function (element, values) {
    var options = Array.prototype.slice.call(element.options, 0);
    var firstEnableOption = null;

    options.forEach(function (option) {
      option.disabled = values.indexOf(option.value) < 0;

      if (!firstEnableOption && !option.disabled) {
        firstEnableOption = option;
        firstEnableOption.selected = true;
      }
    });
  };

  var showMessage = function (isError, title, text, time) {
    var mainElement = document.querySelector('main');
    var messageElement = document.querySelector('template').content.querySelector('.message');
    var message = messageElement.cloneNode(true);
    var messageTitle = message.querySelector('.message__title');
    var messageText = message.querySelector('.message__text');

    if (isError) {
      message.classList.add('message--error');
    }

    messageTitle.textContent = title;
    messageText.textContent = text;
    mainElement.appendChild(message);

    setTimeout(function () {
      mainElement.removeChild(message);
    }, time);
  };
  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    getFragment: getFragment,
    setListeners: setListeners,
    getClickHandler: getClickHandler,
    getKeydownHandler: getKeydownHandler,
    getProperties: getProperties,
    syncValues: syncValues,
    syncValueWithMin: syncValueWithMin,
    syncMultipleValues: syncMultipleValues,
    showMessage: showMessage
  };
})();
