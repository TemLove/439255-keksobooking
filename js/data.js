'use strict';

(function () {
  var AVATAR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира',
    'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1e6;
  var APARTMENT_TYPE = ['flat', 'house', 'bungalo'];
  var ROOMS_MIN_VALUE = 1;
  var ROOMS_MAX_VALUE = 5;
  var GUESTS_MAX_VALUE = 15;
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var X_POINT_MIN = 300;
  var X_POINT_MAX = 900;
  var Y_POINT_MIN = 100;
  var Y_POINT_MAX = 500;
  var getRandomNumber = function (max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min) + min);
  };

  var getRandomElement = function (arr) {
    return arr[getRandomNumber(arr.length)];
  };

  var getUniqueRandomElement = function (arr) {
    return arr.splice(getRandomNumber(arr.length), 1).join('');
  };

  var getRandomizedArray = function (source, length) {
    length = length || source.length;
    var arr = source.slice();
    var result = [];
    while (length-- > 0) {
      if (!arr.length) {
        arr = source.slice();
      }
      result.push(getUniqueRandomElement(arr));
    }
    return result;
  };

  var getPosters = function (amount) {
    var posters = [];
    var avatarNumbers = getRandomizedArray(AVATAR_NUMBERS, amount);
    var offerTitles = getRandomizedArray(OFFER_TITLES, amount);
    var RandomPoster = function () {
      var poster = this;
      this.author = {
        avatar: 'img/avatars/user' + getUniqueRandomElement(avatarNumbers) + '.png'
      };
      this.offer = {
        title: getUniqueRandomElement(offerTitles),
        get address() {
          return poster.location.x + ', ' + poster.location.y;
        },
        price: getRandomNumber(MAX_PRICE, MIN_PRICE),
        type: getRandomElement(APARTMENT_TYPE),
        rooms: getRandomNumber(ROOMS_MAX_VALUE, ROOMS_MIN_VALUE),
        guests: getRandomNumber(GUESTS_MAX_VALUE),
        checkin: getRandomElement(CHECKIN_TIMES),
        checkout: getRandomElement(CHECKOUT_TIMES),
        features: getRandomizedArray(OFFER_FEATURES, getRandomNumber(OFFER_FEATURES.length)),
        description: [],
        photos: []
      };
      this.location = {
        x: getRandomNumber(X_POINT_MAX + 1, X_POINT_MIN),
        y: getRandomNumber(Y_POINT_MAX + 1, Y_POINT_MIN)
      };
    };

    while (amount-- > 0) {
      posters.push(new RandomPoster());
    }
    return posters;
  };
  window.data = {
    getPosters: getPosters
  };
})();
