'use strict';

(function () {
  var noticeFormElement = document.querySelector('.notice__form');
  var checkInSelectElement = noticeFormElement.querySelector('#timein');
  var checkOutSelectElement = noticeFormElement.querySelector('#timeout');
  var typeSelectElement = noticeFormElement.querySelector('#type');
  var priceInputElement = noticeFormElement.querySelector('#price');
  var roomNumberSelectElement = noticeFormElement.querySelector('#room_number');
  var capacitySelectElement = noticeFormElement.querySelector('#capacity');

  window.synchronizeFields(checkInSelectElement, checkOutSelectElement,
      ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], window.util.syncValues);
  window.synchronizeFields(checkOutSelectElement, checkInSelectElement,
      ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], window.util.syncValues);
  window.synchronizeFields(typeSelectElement, priceInputElement,
      ['flat', 'bungalo', 'house', 'palace'], [1000, 0, 5000, 1e4], window.util.syncValueWithMin);
  window.synchronizeFields(roomNumberSelectElement, capacitySelectElement,
      ['1', '2', '3', '100'], [['1'], ['1', '2'], ['1', '2', '3'], ['0']], window.util.syncMultipleValues);
  window.form = {
    noticeFormElement: noticeFormElement
  };
})();
