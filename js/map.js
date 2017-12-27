'use strict';

(function () {
  var COORDS = {
    X_MIN_POINT: 0,
    X_MAX_POINT: window.element.map.clientWidth,
    Y_MIN_POINT: 100 + window.pin.MAP_PIN.MAIN_PIN_Y_OFFSET,
    Y_MAX_POINT: 500 + window.pin.MAP_PIN.MAIN_PIN_Y_OFFSET
  };
  var MESSAGE_ERROR_TITLE = 'Ошибка отображения похожих объявлений';
  var MESSAGE_SHOW_TIME = 3000;
  var LOAD_TIMEOUT = 1000;

  var mapPinsListElement = window.element.map.querySelector('.map__pins');
  var mapFiltersElement = window.element.map.querySelector('.map__filters');
  var noticeFormFieldsetElements = window.element.noticeForm.querySelectorAll('fieldset');

  var posters = null;
  var dataLoadHandler = function (data) {
    posters = data;
  };

  var dataErrorHandler = function (error) {
    window.util.showMessage(true, MESSAGE_ERROR_TITLE, error, MESSAGE_SHOW_TIME);
  };

  var removePosters = function () {
    var pinElements = window.element.map.querySelectorAll('.map__pin:not(.map__pin--main)');
    Array.prototype.forEach.call(pinElements, function (pin) {
      mapPinsListElement.removeChild(pin);
    });
  };

  var showPosters = function () {
    if (posters) {
      var postersToDisplay = window.filterData(posters).slice(0, 5);
      var mapPinsFragment = window.util.getFragment(postersToDisplay, window.pin.renderMapPin);
      mapPinsListElement.appendChild(mapPinsFragment);
      window.showCard(window.element.map, posters);
    } else {
      setTimeout(function () {
        showPosters();
      }, LOAD_TIMEOUT);
    }
  };

  var reShowPosters = function () {
    removePosters();
    showPosters();
  };

  var filtersChangeHandler = function () {
    window.debounce(reShowPosters);
  };

  var activateMap = function () {
    showPosters();
    mapFiltersElement.addEventListener('change', filtersChangeHandler);
    window.element.map.classList.remove('map--faded');
    window.element.noticeForm.classList.remove('notice__form--disabled');
    Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
      fieldset.disabled = false;
    });
  };

  var mouseDownHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinCoords = {
        x: (window.element.mapPinMain.offsetLeft - shift.x),
        y: (window.element.mapPinMain.offsetTop - shift.y)
      };
      pinCoords.x = Math.max(COORDS.X_MIN_POINT, Math.min(pinCoords.x, COORDS.X_MAX_POINT));
      pinCoords.y = Math.max(COORDS.Y_MIN_POINT, Math.min(pinCoords.y, COORDS.Y_MAX_POINT));

      window.element.mapPinMain.style.top = pinCoords.y + 'px';
      window.element.mapPinMain.style.left = pinCoords.x + 'px';
      window.form.setAddress();
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      activateMap();
      window.util.setListeners(document, 'remove', ['mousemove', 'mouseup'], [mouseMoveHandler, mouseUpHandler]);
    };

    window.util.setListeners(document, 'add', ['mousemove', 'mouseup'], [mouseMoveHandler, mouseUpHandler]);
  };

  window.element.mapPinMain.addEventListener('mousedown', mouseDownHandler);
  window.form.setAddress();

  Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
    fieldset.disabled = true;
  });
  window.backend.load(dataLoadHandler, dataErrorHandler);
})();
