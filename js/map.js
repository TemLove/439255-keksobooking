'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapPinsListElement = mapElement.querySelector('.map__pins');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapFiltersElement = mapElement.querySelector('.map__filters');
  var noticeFormFieldsetElements = window.form.noticeFormElement.querySelectorAll('fieldset');
  var posters = null;
  var Coords = {
    X_MIN_POINT: 0,
    X_MAX_POINT: mapElement.clientWidth,
    Y_MIN_POINT: 100,
    Y_MAX_POINT: 500
  };

  var dataLoadHandler = function (data) {
    posters = data;
  };
  var dataErrorHandler = function (error) {
    window.util.showMessage(true, 'Ошибка отображения похожих объявлений', error, 3000);
  };
  var removePosters = function () {
    var pinElements = mapElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    Array.prototype.forEach.call(pinElements, function (pin) {
      mapPinsListElement.removeChild(pin);
    });
  };
  var showPosters = function () {
    if (posters) {
      var postersToDisplay = window.filterData(posters).slice(0, 5);
      var mapPinsFragment = window.util.getFragment(postersToDisplay, window.pin.renderMapPin);
      mapPinsListElement.appendChild(mapPinsFragment);
      window.showCard(mapElement, posters);
    } else {
      setTimeout(function () {
        showPosters();
      }, 1000);
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
    mapElement.classList.remove('map--faded');
    window.form.noticeFormElement.classList.remove('notice__form--disabled');
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
        x: (mapPinMainElement.offsetLeft - shift.x),
        y: (mapPinMainElement.offsetTop - shift.y)
      };
      if (pinCoords.y < Coords.Y_MIN_POINT + window.pin.MapPin.MAIN_PIN_Y_OFFSET) {
        pinCoords.y = Coords.Y_MIN_POINT + window.pin.MapPin.MAIN_PIN_Y_OFFSET;
      }
      if (pinCoords.y > Coords.Y_MAX_POINT + window.pin.MapPin.MAIN_PIN_Y_OFFSET) {
        pinCoords.y = Coords.Y_MAX_POINT + window.pin.MapPin.MAIN_PIN_Y_OFFSET;
      }
      if (pinCoords.x < Coords.X_MIN_POINT) {
        pinCoords.x = Coords.X_MIN_POINT;
      }
      if (pinCoords.x > Coords.X_MAX_POINT) {
        pinCoords.x = Coords.X_MAX_POINT;
      }

      mapPinMainElement.style.top = pinCoords.y + 'px';
      mapPinMainElement.style.left = pinCoords.x + 'px';
      window.form.setAddress();
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      activateMap();
      window.util.setListeners(document, 'remove', ['mousemove', 'mouseup'], [mouseMoveHandler, mouseUpHandler]);
    };

    window.util.setListeners(document, 'add', ['mousemove', 'mouseup'], [mouseMoveHandler, mouseUpHandler]);
  };
  mapPinMainElement.addEventListener('mousedown', mouseDownHandler);
  window.form.setAddress();
  Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
    fieldset.disabled = true;
  });
  window.backend.load(dataLoadHandler, dataErrorHandler);
})();
