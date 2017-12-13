'use strict';

(function () {
  var MIN_PRICES_BY_APARTMENT_TYPES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 1e4
  };

  var noticeFormElement = document.querySelector('.notice__form');
  var checkInSelectElement = noticeFormElement.querySelector('#timein');
  var checkOutSelectElement = noticeFormElement.querySelector('#timeout');
  var typeSelectElement = noticeFormElement.querySelector('#type');
  var priceInputElement = noticeFormElement.querySelector('#price');
  var roomNumberSelectElement = noticeFormElement.querySelector('#room_number');
  var capacitySelectElement = noticeFormElement.querySelector('#capacity');
  var capacityOptionElements = Array.prototype.slice.call(capacitySelectElement.options).reverse();
  var findSelectedOption = function (select) {
    var selectedOption = null;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].selected) {
        selectedOption = select.options[i];
        break;
      }
    }
    return selectedOption;
  };

  var setCheckTime = function (evt) {
    var firstSelect = evt.target;
    var secondSelect = firstSelect === checkInSelectElement ? checkOutSelectElement : checkInSelectElement;
    for (var i = 0; i < firstSelect.options.length; i++) {
      if (firstSelect.options[i].selected) {
        secondSelect.options[i].selected = true;
        break;
      }
    }
  };

  var setMinPrice = function () {
    var selectedOption = findSelectedOption(typeSelectElement);
    priceInputElement.min = MIN_PRICES_BY_APARTMENT_TYPES[selectedOption.value];
    priceInputElement.placeholder = priceInputElement.min;
  };

  var setGuestOptions = function () {
    var selectedOptionValue = findSelectedOption(roomNumberSelectElement).value;
    capacityOptionElements.forEach(function (option) {
      option.disabled = true;
    });
    if (selectedOptionValue === '100') {
      capacitySelectElement.options[3].disabled = false;
      capacitySelectElement.options[3].selected = true;
    } else {
      var capacityOptions = capacityOptionElements.slice(1);
      capacityOptions.length = +selectedOptionValue;
      capacityOptions.forEach(function (option) {
        option.disabled = false;
      });
      capacityOptions[0].selected = true;
    }
  };

  var formChangeHandler = function (evt) {
    if (evt.target === checkInSelectElement || evt.target === checkOutSelectElement) {
      setCheckTime(evt);
    }
    if (evt.target === typeSelectElement) {
      setMinPrice();
    }
    if (evt.target === roomNumberSelectElement) {
      setGuestOptions();
    }
  };
  setMinPrice();
  setGuestOptions();
  noticeFormElement.addEventListener('change', formChangeHandler, true);
  window.form = {
    noticeFormElement: noticeFormElement
  };

})();
