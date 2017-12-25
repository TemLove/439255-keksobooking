'use strict';

(function () {
  var checkInSelectElement = window.element.noticeForm.querySelector('#timein');
  var checkOutSelectElement = window.element.noticeForm.querySelector('#timeout');
  var typeSelectElement = window.element.noticeForm.querySelector('#type');
  var priceInputElement = window.element.noticeForm.querySelector('#price');
  var roomNumberSelectElement = window.element.noticeForm.querySelector('#room_number');
  var capacitySelectElement = window.element.noticeForm.querySelector('#capacity');
  var addressInputElement = window.element.noticeForm.querySelector('#address');
  var resetButtonElement = window.element.noticeForm.querySelector('.form__reset');
  var syncValues = {
    checkIn: ['12:00', '13:00', '14:00'],
    checkOut: ['12:00', '13:00', '14:00'],
    type: ['flat', 'bungalo', 'house', 'palace'],
    minPrice: [1000, 0, 5000, 10000],
    roomNumbers: ['1', '2', '3', '100'],
    guests: [['1'], ['1', '2'], ['1', '2', '3'], ['0']]
  };
  var formInitialValue = {
    addressX: 600,
    addressY: 375
  };
  var DEFAULT_AVATAR_SRC = 'img/muffin.png';
  var Message = {
    successLoadTitle: 'Данные успешно отправлены',
    successLoadText: 'Ваше объявление добавлено в базу.',
    errorLoadTitle: 'Ошибка отправки формы',
    showTime: 3000
  };

  var setAddress = function () {
    var locationX = parseInt(getComputedStyle(window.element.mapPinMain).getPropertyValue('left'), 10);
    var locationY = parseInt(getComputedStyle(window.element.mapPinMain).getPropertyValue('top'), 10)
        - window.pin.MapPin.MAIN_PIN_Y_OFFSET;
    addressInputElement.value = 'x: ' + locationX + ', y: ' + locationY;
  };
  var resetForm = function () {
    window.element.noticeForm.reset();
    window.element.avatarPreview.src = DEFAULT_AVATAR_SRC;
    window.preview.clear(window.element.photoPreview);
    window.element.mapPinMain.style.top = formInitialValue.addressY + 'px';
    window.element.mapPinMain.style.left = formInitialValue.addressX + 'px';
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
    window.util.showMessage(false, Message.successLoadTitle, Message.successLoadText, Message.showTime);
  };
  var formErrorHandler = function (error) {
    window.util.showMessage(true, Message.errorLoadTitle, error, Message.showTime);
  };
  var formSubmitHandler = function (evt) {
    window.backend.save(new FormData(window.element.noticeForm), formSuccessHandler, formErrorHandler);
    evt.preventDefault();
  };
  var resetButtonClickHandler = function (evt) {
    evt.preventDefault();
    resetForm();
  };

  setMinPrice();
  setGuestsAmount();
  window.util.setListeners(window.element.noticeForm, 'add', ['change', 'submit'], [formChangeHandler, formSubmitHandler]);
  resetButtonElement.addEventListener('click', resetButtonClickHandler);

  window.form = {
    setAddress: setAddress
  };
})();
