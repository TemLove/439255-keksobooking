'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var noticeFormElement = document.querySelector('.notice__form');
  window.element = {
    map: mapElement,
    mapPinMain: mapPinMainElement,
    noticeForm: noticeFormElement,
    avatarFileChooser: noticeFormElement.querySelector('#avatar'),
    avatarPreview: noticeFormElement.querySelector('.notice__preview img'),
    photoFileChooser: noticeFormElement.querySelector('#images'),
    photoPreview: noticeFormElement.querySelector('.form__photo-container')
  };
})();
