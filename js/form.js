'use strict';

(function () {
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var noticeFormElement = document.querySelector('.notice__form');
  var checkInSelectElement = noticeFormElement.querySelector('#timein');
  var checkOutSelectElement = noticeFormElement.querySelector('#timeout');
  var typeSelectElement = noticeFormElement.querySelector('#type');
  var priceInputElement = noticeFormElement.querySelector('#price');
  var roomNumberSelectElement = noticeFormElement.querySelector('#room_number');
  var capacitySelectElement = noticeFormElement.querySelector('#capacity');
  var addressInputElement = noticeFormElement.querySelector('#address');
  var resetButtonElement = noticeFormElement.querySelector('.form__reset');
  var syncValues = {
    checkIn: ['12:00', '13:00', '14:00'],
    checkOut: ['12:00', '13:00', '14:00'],
    type: ['flat', 'bungalo', 'house', 'palace'],
    minPrice: [1000, 0, 5000, 1e4],
    roomNumbers: ['1', '2', '3', '100'],
    guests: [['1'], ['1', '2'], ['1', '2', '3'], ['0']]
  };
  var formInitialValue = {
    addressX: 600,
    addressY: 375
  };

  var setAddress = function () {
    var locationX = parseInt(getComputedStyle(mapPinMainElement).getPropertyValue('left'), 10);
    var locationY = parseInt(getComputedStyle(mapPinMainElement).getPropertyValue('top'), 10)
        - window.pin.MapPin.MAIN_PIN_Y_OFFSET;
    addressInputElement.value = 'x: ' + locationX + ', y: ' + locationY;
  };
  var resetForm = function () {
    noticeFormElement.reset();
    mapPinMainElement.style.top = formInitialValue.addressY + 'px';
    mapPinMainElement.style.left = formInitialValue.addressX + 'px';
    setAddress();
    setMinPrice();
    setGuestsAmount();
  };
  var setCheckOutTime = function () {
    window.synchronizeFields(checkInSelectElement, checkOutSelectElement,
        syncValues.checkIn, syncValues.checkOut, window.util.syncValues);
  };
  var setCheckInTime = function () {
    window.synchronizeFields(checkOutSelectElement, checkInSelectElement,
        syncValues.checkOut, syncValues.checkIn, window.util.syncValues);
  };
  var setMinPrice = function () {
    window.synchronizeFields(typeSelectElement, priceInputElement,
        syncValues.type, syncValues.minPrice, window.util.syncValueWithMin);
  };
  var setGuestsAmount = function () {
    window.synchronizeFields(roomNumberSelectElement, capacitySelectElement,
        syncValues.roomNumbers, syncValues.guests, window.util.syncMultipleValues);
  };
  var formChangeHandler = function (evt) {
    if (evt.target === checkInSelectElement) {
      setCheckOutTime();
    }
    if (evt.target === checkOutSelectElement) {
      setCheckInTime();
    }
    if (evt.target === typeSelectElement) {
      setMinPrice();
    }
    if (evt.target === roomNumberSelectElement) {
      setGuestsAmount();
    }
  };
  var formSuccessHandler = function () {
    resetForm();
    window.util.showMessage(false, 'Данные успешно отправлены', 'Ваше объявление добавлено в базу.', 3000);
  };
  var formErrorHandler = function (error) {
    window.util.showMessage(true, 'Ошибка отправки формы', error, 3000);
  };
  var formSubmitHandler = function (evt) {
    window.backend.save(new FormData(noticeFormElement), formSuccessHandler, formErrorHandler);
    evt.preventDefault();
  };
  var resetButtonClickHandler = function (evt) {
    evt.preventDefault();
    resetForm();
  };

  setMinPrice();
  setGuestsAmount();
  window.util.setListeners(noticeFormElement, 'add', ['change', 'submit'], [formChangeHandler, formSubmitHandler]);
  resetButtonElement.addEventListener('click', resetButtonClickHandler);

  window.form = {
    noticeFormElement: noticeFormElement,
    setAddress: setAddress
  };
})();
