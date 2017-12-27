'use strict';

(function () {
  var DEFAULT_AVATAR_SRC = 'img/muffin.png';
  var SYNC_VALUES = {
    checkIn: ['12:00', '13:00', '14:00'],
    checkOut: ['12:00', '13:00', '14:00'],
    type: ['flat', 'bungalo', 'house', 'palace'],
    minPrice: [1000, 0, 5000, 10000],
    roomNumbers: ['1', '2', '3', '100'],
    guests: [['1'], ['1', '2'], ['1', '2', '3'], ['0']]
  };
  var FORM_INITIAL_VALUE = {
    addressX: 600,
    addressY: 375
  };
  var MESSAGE_SHOW_TIME = 3000;
  var Message = {
    successLoadTitle: 'Данные успешно отправлены',
    successLoadText: 'Ваше объявление добавлено в базу.',
    errorLoadTitle: 'Ошибка отправки формы'
  };
  var checkInSelectElement = window.element.noticeForm.querySelector('#timein');
  var checkOutSelectElement = window.element.noticeForm.querySelector('#timeout');
  var typeSelectElement = window.element.noticeForm.querySelector('#type');
  var priceInputElement = window.element.noticeForm.querySelector('#price');
  var roomNumberSelectElement = window.element.noticeForm.querySelector('#room_number');
  var capacitySelectElement = window.element.noticeForm.querySelector('#capacity');
  var addressInputElement = window.element.noticeForm.querySelector('#address');
  var resetButtonElement = window.element.noticeForm.querySelector('.form__reset');
  var setAddress = function () {
    var locationX = parseInt(getComputedStyle(window.element.mapPinMain).getPropertyValue('left'), 10);
    var locationY = parseInt(getComputedStyle(window.element.mapPinMain).getPropertyValue('top'), 10)
        - window.pin.MAP_PIN.MAIN_PIN_Y_OFFSET;
    addressInputElement.value = 'x: ' + locationX + ', y: ' + locationY;
  };

  var resetForm = function () {
    window.element.noticeForm.reset();
    window.element.avatarPreview.src = DEFAULT_AVATAR_SRC;
    window.preview.clear(window.element.photoPreview);
    window.element.mapPinMain.style.top = FORM_INITIAL_VALUE.addressY + 'px';
    window.element.mapPinMain.style.left = FORM_INITIAL_VALUE.addressX + 'px';
    setAddress();
    setMinPrice();
    setGuestsAmount();
  };

  var setCheckOutTime = function () {
    window.synchronizeFields(checkInSelectElement, checkOutSelectElement,
        SYNC_VALUES.checkIn, SYNC_VALUES.checkOut, window.util.syncValues);
  };

  var setCheckInTime = function () {
    window.synchronizeFields(checkOutSelectElement, checkInSelectElement,
        SYNC_VALUES.checkOut, SYNC_VALUES.checkIn, window.util.syncValues);
  };

  var setMinPrice = function () {
    window.synchronizeFields(typeSelectElement, priceInputElement,
        SYNC_VALUES.type, SYNC_VALUES.minPrice, window.util.syncValueWithMin);
  };

  var setGuestsAmount = function () {
    window.synchronizeFields(roomNumberSelectElement, capacitySelectElement,
        SYNC_VALUES.roomNumbers, SYNC_VALUES.guests, window.util.syncMultipleValues);
  };

  var SyncronizeHandler = {
    'timein': setCheckOutTime,
    'timeout': setCheckInTime,
    'type': setMinPrice,
    'rooms': setGuestsAmount
  };
  var formChangeHandler = function (evt) {
    if (evt.target.name in SyncronizeHandler) {
      SyncronizeHandler[evt.target.name]();
    }
  };

  var formSuccessHandler = function () {
    resetForm();
    window.util.showMessage(false, Message.successLoadTitle, Message.successLoadText, MESSAGE_SHOW_TIME);
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
