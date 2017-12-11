'use strict';

(function () {
  var mapPin = {
    MAP_PIN_HEIGHT: 44,
    PIN_WIDTH: 10,
    PIN_HEIGHT: 18
  };
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var renderMapPin = function (pin) {
    var mapPinElement = mapPinTemplate.cloneNode(true);
    var mapPinImgElement = mapPinElement.querySelector('img');
    var offsetX = mapPin.PIN_WIDTH / 2;
    var offsetY = mapPin.MAP_PIN_HEIGHT / 2 + mapPin.PIN_HEIGHT;
    var style = 'left: ' + (pin.location.x - offsetX) + 'px; top: ' + (pin.location.y - offsetY) + 'px;';
    mapPinElement.setAttribute('style', style);
    mapPinImgElement.setAttribute('src', pin.author.avatar);
    return mapPinElement;
  };
  window.pin = {
    mapPin: mapPin,
    renderMapPin: renderMapPin
  };
})();
