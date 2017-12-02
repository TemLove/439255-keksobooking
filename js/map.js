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
var MAP_PIN_HEIGHT = 44;
var PIN_WIDTH = 10;
var PIN_HEIGHT = 18;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var mapElement = document.querySelector('.map');
var mapPinsListElement = mapElement.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var noticeFormElement = document.querySelector('.notice__form');
var noticeFormFieldsetElements = noticeFormElement.querySelectorAll('fieldset');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var mapPinElements;
var posters;

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
  posters = [];
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

var getRoomsAndGuestsString = function (roomsValue, guestsValue) {
  var roomsStr;
  if (roomsValue > 4) {
    roomsStr = ' комнат';
  } else {
    roomsStr = roomsValue === 1 ? ' комната' : ' комнаты';
  }
  var guestsStr = guestsValue === 1 ? ' гостя' : ' гостей';
  return roomsValue + roomsStr + ' для ' + guestsValue + guestsStr;
};

var getFeaturesString = function (features) {
  var featuresStr = '';
  features.forEach(function (item) {
    featuresStr += '<li class="feature feature--' + item + '"></li>';
  });
  return featuresStr;
};

var renderMapPin = function (mapPin) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  var mapPinImgElement = mapPinElement.querySelector('img');
  var offsetX = PIN_WIDTH / 2;
  var offsetY = MAP_PIN_HEIGHT / 2 + PIN_HEIGHT;
  var style = 'left: ' + (mapPin.location.x - offsetX) + 'px; top: ' + (mapPin.location.y - offsetY) + 'px;';
  mapPinElement.setAttribute('style', style);
  mapPinImgElement.setAttribute('src', mapPin.author.avatar);
  return mapPinElement;
};

var renderMapCard = function (card) {
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
  mapCardParagraphElements[4].textContent = card.offer.description.toString();
  mapCardFeaturesElement.innerHTML = getFeaturesString(card.offer.features);
  return mapCardElement;
};

var getFragment = function (data, renderMethod) {
  data = Array.isArray(data) ? data : [data];
  var fragment = document.createDocumentFragment();
  data.forEach(function (item) {
    fragment.appendChild(renderMethod(item));
  });
  return fragment;
};

var setListeners = function (element, action, events, handlers) {
  if (action === 'add') {
    events.forEach(function (event, index) {
      element.addEventListener(event, handlers[index]);
    });
  }
  if (action === 'remove') {
    events.forEach(function (event, index) {
      element.removeEventListener(event, handlers[index]);
    });
  }
};

var getClickHandler = function (method) {
  return function (evt) {
    method(evt);
  };
};

var getKeydownHandler = function (keyCode, method) {
  return function (evt) {
    if (evt.keyCode === keyCode) {
      method(evt);
    }
  };
};

var getProperties = function (str) {
  var result = {};
  var properties = str.split(';');
  properties.forEach(function (value) {
    if (value) {
      var propertyInfo = value.split(':');
      result[propertyInfo[0].trim()] = propertyInfo[1].trim();
    }
  });
  return result;
};

var activatePin = function (evt) {
  var mapPinActiveElements = mapElement.querySelector('.map__pin--active');
  var popup = mapElement.querySelector('.popup');
  if (mapPinActiveElements) {
    mapPinActiveElements.classList.remove('map__pin--active');
  }
  if (popup) {
    mapElement.removeChild(popup);
  }
  evt.currentTarget.classList.add('map__pin--active');
  openPopup(evt.currentTarget);
};

var mapPinClickHandler = getClickHandler(activatePin);
var mapPinEnterPressHandler = getKeydownHandler(ENTER_KEYCODE, activatePin);

var activateMap = function () {
  if (!posters) {
    posters = getPosters(8);
  }
  var mapPinsFragment = getFragment(posters, renderMapPin);
  mapPinsListElement.appendChild(mapPinsFragment);
  mapElement.classList.remove('map--faded');
  noticeFormElement.classList.remove('notice__form--disabled');

  mapPinElements = mapElement.querySelectorAll('.map__pin');
  for (var i = 1; i < mapPinElements.length; i++) {
    setListeners(mapPinElements[i], 'add', ['click', 'keydown'], [mapPinClickHandler, mapPinEnterPressHandler]);
  }
  Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
    fieldset.removeAttribute('disabled');
  });
};

var openPopup = function (mapPinElement) {
  var style = getProperties(mapPinElement.getAttribute('style'));
  var index = posters.findIndex(function (poster) {
    var condition1 = poster.location.x === (parseInt(style.left, 10) + PIN_WIDTH / 2);
    var condition2 = poster.location.y === (parseInt(style.top, 10)) + MAP_PIN_HEIGHT / 2 + PIN_HEIGHT;
    return condition1 && condition2;
  });
  var cardsFragment = getFragment(posters[index], renderMapCard);
  mapElement.appendChild(cardsFragment);
  var popupCloseButton = mapElement.querySelector('.popup__close');
  document.addEventListener('keydown', popupEscPressHandler);
  setListeners(popupCloseButton, 'add', ['click', 'keydown'], [popupCloseBtnClickHandler, popupCloseBtnEnterPressHandler]);
};

var closePopup = function () {
  var popup = mapElement.querySelector('.popup');
  var activePin = mapElement.querySelector('.map__pin--active');
  if (popup) {
    var popupCloseButton = mapElement.querySelector('.popup__close');
    mapElement.removeChild(popup);
    activePin.classList.remove('map__pin--active');
  }
  document.removeEventListener('keydown', popupEscPressHandler);
  setListeners(popupCloseButton, 'remove', ['click', 'keydown'], [popupCloseBtnClickHandler, popupCloseBtnEnterPressHandler]);
};

var popupEscPressHandler = getKeydownHandler(ESC_KEYCODE, closePopup);
var popupCloseBtnClickHandler = getClickHandler(closePopup);
var popupCloseBtnEnterPressHandler = getKeydownHandler(ENTER_KEYCODE, closePopup);

var mapPinMainMouseupHandler = getClickHandler(activateMap);
mapPinMainElement.addEventListener('mouseup', mapPinMainMouseupHandler);
Array.prototype.forEach.call(noticeFormFieldsetElements, function (fieldset) {
  fieldset.setAttribute('disabled', 'disabled');
});
