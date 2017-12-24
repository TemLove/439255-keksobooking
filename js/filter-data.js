'use strict';

(function () {
  var mapFiltersElement = document.querySelector('.map__filters-container');
  var featuresFilterElements = mapFiltersElement.querySelectorAll('[name="features"]');
  var typeFilterElement = mapFiltersElement.querySelector('#housing-type');
  var priceFilterElement = mapFiltersElement.querySelector('#housing-price');
  var roomsFilterElement = mapFiltersElement.querySelector('#housing-rooms');
  var guestsFilterElement = mapFiltersElement.querySelector('#housing-guests');

  var filterByValue = function (field, filterElement) {
    return function (data) {
      var condition = (data.offer[field]).toString(10) === filterElement.value;
      return filterElement.value === 'any' ? true : condition;
    };
  };
  var isTypeFit = filterByValue('type', typeFilterElement);
  var isRoomsFit = filterByValue('rooms', roomsFilterElement);
  var isGuestsFit = filterByValue('guests', guestsFilterElement);
  var isPriceFit = function (data) {
    var condition = {
      high: data.offer.price >= 50000,
      middle: data.offer.price >= 10000 && data.offer.price < 50000,
      low: data.offer.price < 10000
    };
    return priceFilterElement.value === 'any' ? true : condition[priceFilterElement.value];
  };
  var isFeaturesFit = function (data) {
    var checkedFeatures = Array.prototype.slice.call(featuresFilterElements, 0).filter(function (feature) {
      return feature.checked;
    });
    return checkedFeatures.every(function (feature) {
      return data.offer.features.indexOf(feature.value) >= 0;
    });
  };
  var filters = [isTypeFit, isRoomsFit, isGuestsFit, isPriceFit, isFeaturesFit];

  window.filterData = function (data) {
    var filterCallback = function (dataItem) {
      return filters.every(function (filterCheck) {
        return filterCheck(dataItem);
      });
    };
    return data.slice().filter(filterCallback);
  };
})();
