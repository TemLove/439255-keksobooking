'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
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
    addressInputElement.value = locationX + ', ' + locationY;
  };

  var openPopup = function (mapPinElement) {
    var style = window.util.getProperties(mapPinElement.getAttribute('style'));
    var condition1 = parseInt(style.left, 10) + window.pin.mapPin.PIN_WIDTH / 2;
    var condition2 = parseInt(style.top, 10) + window.pin.mapPin.MAP_PIN_HEIGHT / 2 + window.pin.mapPin.PIN_HEIGHT;
    for (var i = 0; i < posters.length; i++) {
      if (posters[i].location.x === condition1 && posters[i].location.y === condition2) {
        var cardFragment = window.util.getFragment(posters[i], window.card.renderMapCard);
        break;
      }
    }
    mapElement.appendChild(cardFragment);
    var popupCloseButton = mapElement.querySelector('.popup__close');
    document.addEventListener('keydown', popupEscPressHandler);
    window.util.setListeners(popupCloseButton, 'add', ['click', 'keydown'],
        [popupCloseBtnClickHandler, popupCloseBtnEnterPressHandler]);
  };

  var closePopup = function () {
    var popup = mapElement.querySelector('.popup');
    var activePin = mapElement.querySelector('.map__pin--active');
    if (popup) {
      var popupCloseButton = mapElement.querySelector('.popup__close');
      mapElement.removeChild(popup);
      activePin.classList.remove('map__pin--active');
    }
    document.removeEventListener('keydown', popupEscPressHandler);
    window.util.setListeners(popupCloseButton, 'remove', ['click', 'keydown'],
        [popupCloseBtnClickHandler, popupCloseBtnEnterPressHandler]);
  };

  var popupEscPressHandler = window.util.getKeydownHandler(ESC_KEYCODE, closePopup);
  var popupCloseBtnClickHandler = window.util.getClickHandler(closePopup);
  var popupCloseBtnEnterPressHandler = window.util.getKeydownHandler(ENTER_KEYCODE, closePopup);

  var activatePin = function (evt) {
    var mapPinActiveElement = mapElement.querySelector('.map__pin--active');
    var popup = mapElement.querySelector('.popup');
    var target = null;
    if (mapPinActiveElement) {
      mapPinActiveElement.classList.remove('map__pin--active');
    }
    if (popup) {
      mapElement.removeChild(popup);
    }
    if (evt.target.className === 'map__pin') {
      target = evt.target;
    }
    if (evt.target.parentElement.className === 'map__pin') {
      target = evt.target.parentElement;
    }
    if (target) {
      target.classList.add('map__pin--active');
      openPopup(target);
    }
  };

  var mapPinClickHandler = window.util.getClickHandler(activatePin);
  var mapPinEnterPressHandler = window.util.getKeydownHandler(ENTER_KEYCODE, activatePin);

  var activateMap = function () {
    if (!posters) {
      posters = window.data.getPosters(8);
    }
    var mapPinsFragment = window.util.getFragment(posters, window.pin.renderMapPin);
    mapPinsListElement.appendChild(mapPinsFragment);
    window.util.setListeners(mapElement, 'add', ['click', 'keydown'], [mapPinClickHandler, mapPinEnterPressHandler]);
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
      if (pinCoords.y < 100 + MAIN_PIN_Y_OFFSET) {
        pinCoords.y = 100 + MAIN_PIN_Y_OFFSET;
      }
      if (pinCoords.y > 500 + MAIN_PIN_Y_OFFSET) {
        pinCoords.y = 500 + MAIN_PIN_Y_OFFSET;
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

  Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
    fieldset.disabled = true;
  });
})();
