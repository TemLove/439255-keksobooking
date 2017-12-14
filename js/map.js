'use strict';

(function () {
  var MAIN_PIN_Y_OFFSET = 16;
  var mapElement = document.querySelector('.map');
  var mapPinsListElement = mapElement.querySelector('.map__pins');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var addressInputElement = window.form.noticeFormElement.querySelector('#address');
  var noticeFormFieldsetElements = window.form.noticeFormElement.querySelectorAll('fieldset');
  var posters;
  var setAddress = function () {
    var locationX = parseInt(getComputedStyle(mapPinMainElement).getPropertyValue('left'), 10);
    var locationY = parseInt(getComputedStyle(mapPinMainElement).getPropertyValue('top'), 10) - MAIN_PIN_Y_OFFSET;
    addressInputElement.value = 'x: ' + locationX + ', y: ' + locationY;
  };

  var activateMap = function () {
    if (!posters) {
      posters = window.data.getPosters(8);
    }
    var mapPinsFragment = window.util.getFragment(posters, window.pin.renderMapPin);
    mapPinsListElement.appendChild(mapPinsFragment);
    window.showCard(mapElement, posters);
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
      if (pinCoords.y < window.data.Coords.Y_POINT_MIN + MAIN_PIN_Y_OFFSET) {
        pinCoords.y = window.data.Coords.Y_POINT_MIN + MAIN_PIN_Y_OFFSET;
      }
      if (pinCoords.y > window.data.Coords.Y_POINT_MAX + MAIN_PIN_Y_OFFSET) {
        pinCoords.y = window.data.Coords.Y_POINT_MAX + MAIN_PIN_Y_OFFSET;
      }
      if (pinCoords.x < window.data.Coords.X_POINT_MIN) {
        pinCoords.x = window.data.Coords.X_POINT_MIN;
      }
      if (pinCoords.x > window.data.Coords.X_POINT_MAX) {
        pinCoords.x = window.data.Coords.X_POINT_MAX;
      }

      mapPinMainElement.style.top = pinCoords.y + 'px';
      mapPinMainElement.style.left = pinCoords.x + 'px';
      setAddress();
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      activateMap();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  mapPinMainElement.addEventListener('mousedown', mouseDownHandler);
  setAddress();
  Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
    fieldset.disabled = true;
  });
})();
