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

  var getPosters = function (amount) {
    var posters = [];
    var avatarNumbers = window.util.getRandomizedArray(AVATAR_NUMBERS, amount);
    var offerTitles = window.util.getRandomizedArray(OFFER_TITLES, amount);
    var RandomPoster = function () {
      var poster = this;
      this.author = {
        avatar: 'img/avatars/user' + window.util.getUniqueRandomElement(avatarNumbers) + '.png'
      };
      this.offer = {
        title: window.util.getUniqueRandomElement(offerTitles),
        get address() {
          return poster.location.x + ', ' + poster.location.y;
        },
        price: window.util.getRandomNumber(MAX_PRICE, MIN_PRICE),
        type: window.util.getRandomElement(APARTMENT_TYPE),
        rooms: window.util.getRandomNumber(ROOMS_MAX_VALUE, ROOMS_MIN_VALUE),
        guests: window.util.getRandomNumber(GUESTS_MAX_VALUE),
        checkin: window.util.getRandomElement(CHECKIN_TIMES),
        checkout: window.util.getRandomElement(CHECKOUT_TIMES),
        features: window.util.getRandomizedArray(OFFER_FEATURES, window.util.getRandomNumber(OFFER_FEATURES.length)),
        description: [],
        photos: []
      };
      this.location = {
        x: window.util.getRandomNumber(X_POINT_MAX + 1, X_POINT_MIN),
        y: window.util.getRandomNumber(Y_POINT_MAX + 1, Y_POINT_MIN)
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
