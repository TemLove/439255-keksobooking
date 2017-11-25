'use strict';

var AVATAR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира',
  'Огромный прекрасный дворец', 'Маленький ужасный дворец',
  'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1e6;
var APARTMENT_TYPE = ['flat', 'house', 'bungalo'];
var APARTMENT_TYPE_TO_DISPLAY = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
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
var PIN_WIDTH = 10;
var PIN_HEIGHT = 18;

var mapElement = document.querySelector('.map');
var mapPinsListElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

function getRandomNumber(max, min) {
  min = min || 0;
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomElement(arr) {
  return arr[getRandomNumber(arr.length)];
}

function getUniqueRandomElement(arr) {
  return arr.splice(getRandomNumber(arr.length), 1).join('');
}

function getRandomizedArray(source, length) {
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
}

function getPosters(amount) {
  var posters = [];
  var avatarNumbers = getRandomizedArray(AVATAR_NUMBERS, amount);
  var offerTitles = getRandomizedArray(OFFER_TITLES, amount);

  function RandomPoster() {
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
  }

  while (amount-- > 0) {
    posters.push(new RandomPoster());
  }
  return posters;
}

function getRoomsAndGuestsString(roomsValue, guestsValue) {
  var roomsStr;
  if (roomsValue > 4) {
    roomsStr = ' комнат';
  } else {
    roomsStr = roomsValue === 1 ? ' комната' : ' комнаты';
  }
  var guestsStr = guestsValue === 1 ? ' гостя' : ' гостей';
  return roomsValue + roomsStr + ' для ' + guestsValue + guestsStr;
}

function getFeaturesString(features) {
  var featuresStr = '';
  features.forEach(function (item) {
    featuresStr += '<li class="feature feature--' + item + '"></li>';
  });
  return featuresStr;
}

function renderMapPin(mapPin) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  var mapPinImgElement = mapPinElement.querySelector('img');
  var offsetX = (+mapPinImgElement.getAttribute('width') + PIN_WIDTH) / 2;
  var offsetY = +mapPinImgElement.getAttribute('height') + PIN_HEIGHT;
  mapPinElement.setAttribute('style', 'left: ' + (mapPin.location.x - offsetX) + 'px; top: ' + (mapPin.location.y - offsetY) + 'px;');
  mapPinImgElement.setAttribute('src', mapPin.author.avatar);
  return mapPinElement;
}

function renderMapCard(card) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var mapCardAvatarElement = mapCardElement.querySelector('.popup__avatar');
  var mapCardTitleElement = mapCardElement.querySelector('h3');
  var mapCardAddressElement = mapCardElement.querySelector('small');
  var mapCardPriceElement = mapCardElement.querySelector('.popup__price');
  var mapApartmentTypeElement = mapCardElement.querySelector('h4');
  var mapCardParagraphElements = mapCardElement.querySelectorAll('p');
  var mapCardFeaturesElement = mapCardElement.querySelector('.popup__features');
  mapCardAvatarElement.setAttribute('src', card.author.avatar);
  mapCardTitleElement.textContent = card.offer.title;
  mapCardAddressElement.textContent = card.offer.address;
  mapCardPriceElement.innerHTML = card.offer.price + '&#x20bd;/ночь';
  mapApartmentTypeElement.textContent = APARTMENT_TYPE_TO_DISPLAY[card.offer.type];
  mapCardParagraphElements[2].textContent = getRoomsAndGuestsString(card.offer.rooms, card.offer.guests);
  mapCardParagraphElements[3].textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  mapCardParagraphElements[4].textContent = card.offer.description;
  mapCardFeaturesElement.innerHTML = getFeaturesString(card.offer.features);
  return mapCardElement;
}

function getFragment(data, renderMethod) {
  data = Array.isArray(data) ? data : [data];
  var fragment = document.createDocumentFragment();
  data.forEach(function (item) {
    fragment.appendChild(renderMethod(item));
  });
  return fragment;
}

var posters = getPosters(8);
mapElement.classList.remove('map--faded');
var mapPinsFragment = getFragment(posters, renderMapPin);
mapPinsListElement.appendChild(mapPinsFragment);
var cardsFragment = getFragment(posters[0], renderMapCard);
mapElement.appendChild(cardsFragment);
