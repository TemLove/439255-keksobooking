'use strict';

(function () {
  window.showCard = function (mapElement, posters) {
    var openPopup = function (mapPinElement) {
      var style = window.util.getProperties(mapPinElement.getAttribute('style'));
      var condition1 = parseInt(style.left, 10) + window.pin.MapPin.PIN_WIDTH / 2;
      var condition2 = parseInt(style.top, 10) + window.pin.MapPin.MAP_PIN_HEIGHT / 2 + window.pin.MapPin.PIN_HEIGHT;
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

    var popupEscPressHandler = window.util.getKeydownHandler(window.util.ESC_KEYCODE, closePopup);
    var popupCloseBtnClickHandler = window.util.getClickHandler(closePopup);
    var popupCloseBtnEnterPressHandler = window.util.getKeydownHandler(window.util.ENTER_KEYCODE, closePopup);

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
    var mapPinEnterPressHandler = window.util.getKeydownHandler(window.util.ENTER_KEYCODE, activatePin);

    window.util.setListeners(mapElement, 'add', ['click', 'keydown'], [mapPinClickHandler, mapPinEnterPressHandler]);
  };
})();
