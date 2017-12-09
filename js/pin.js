'use strict';

(function () {
  var MAP_PIN_HEIGHT = 44;
  var PIN_WIDTH = 10;
  var PIN_HEIGHT = 18;
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var renderMapPin = function (mapPin) {
    var mapPinElement = mapPinTemplate.cloneNode(true);
    var mapPinImgElement = mapPinElement.querySelector('img');
    var offsetX = PIN_WIDTH / 2;
    var offsetY = MAP_PIN_HEIGHT / 2 + PIN_HEIGHT;
    var style = 'left: ' + (mapPin.location.x - offsetX) + 'px; top: ' + (mapPin.location.y - offsetY) + 'px;';
    mapPinElement.setAttribute('style', style);
    mapPinImgElement.setAttribute('src', mapPin.author.avatar);
    return mapPinElement;
  };
  window.pin = {
    MAP_PIN_HEIGHT: MAP_PIN_HEIGHT,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    renderMapPin: renderMapPin
  };
})();
