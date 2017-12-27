'use strict';

(function () {
  window.showCard = function (mapElement, posters) {
    var openPopup = function (mapPinElement) {
      var style = window.util.getProperties(mapPinElement.getAttribute('style'));
      var condition1 = parseInt(style.left, 10) + window.pin.MAP_PIN.PIN_WIDTH / 2;
      var condition2 = parseInt(style.top, 10) + window.pin.MAP_PIN.PIN_HEIGHT;
      var index = null;

      posters.some(function (poster, posterIndex) {
        if (poster.location.x === condition1 && poster.location.y === condition2) {
          index = posterIndex;
          return true;
        }
        return false;
      });

      var cardFragment = window.util.getFragment(posters[index], window.card.renderMapCard);
      mapElement.appendChild(cardFragment);
      document.addEventListener('keydown', popupEscPressHandler);
      window.util.setListeners(mapElement.querySelector('.popup__close'), 'add', ['click', 'keydown'],
          [popupCloseBtnClickHandler, popupCloseBtnEnterPressHandler]);
    };

    var closePopup = function () {
      var popup = mapElement.querySelector('.popup');
      if (popup) {
        var activePin = mapElement.querySelector('.map__pin--active');

        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }

        document.removeEventListener('keydown', popupEscPressHandler);
        window.util.setListeners(mapElement.querySelector('.popup__close'), 'remove', ['click', 'keydown'],
            [popupCloseBtnClickHandler, popupCloseBtnEnterPressHandler]);
        mapElement.removeChild(popup);
      }
    };

    var popupEscPressHandler = window.util.getKeydownHandler(window.util.ESC_KEYCODE, closePopup);
    var popupCloseBtnClickHandler = window.util.getClickHandler(closePopup);
    var popupCloseBtnEnterPressHandler = window.util.getKeydownHandler(window.util.ENTER_KEYCODE, closePopup);

    var isMapPin = function (element) {
      return element.classList.contains('map__pin') && !element.classList.contains('map__pin--main');
    };

    var activatePin = function (evt) {
      var target = null;
      if (isMapPin(evt.target) || isMapPin(evt.target.parentElement)) {
        target = evt.target.tagName === 'IMG' ? evt.target.parentElement : evt.target;
        closePopup();
        target.classList.add('map__pin--active');
        openPopup(target);
      }
    };

    var mapPinClickHandler = window.util.getClickHandler(activatePin);
    var mapPinEnterPressHandler = window.util.getKeydownHandler(window.util.ENTER_KEYCODE, activatePin);

    window.util.setListeners(mapElement, 'add', ['click', 'keydown'], [mapPinClickHandler, mapPinEnterPressHandler]);
  };
})();
