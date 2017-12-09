'use strict';

(function () {
  var APARTMENT_TYPE_TO_DISPLAY = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
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
    mapCardPriceElement.textContent = card.offer.price + '\u20bd/ночь';
    mapApartmentTypeElement.textContent = APARTMENT_TYPE_TO_DISPLAY[card.offer.type];
    mapCardParagraphElements[2].textContent = getRoomsAndGuestsString(card.offer.rooms, card.offer.guests);
    mapCardParagraphElements[3].textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    mapCardParagraphElements[4].textContent = card.offer.description.toString();
    for (var i = 0; i < mapCardFeaturesElement.children.length; i++) {
      for (var j = 0; j < card.offer.features.length; j++) {
        if (mapCardFeaturesElement.children[i].className.indexOf(card.offer.features[j]) >= 0) {
          j = 0;
          break;
        }
      }
      if (j) {
        mapCardFeaturesElement.removeChild(mapCardFeaturesElement.children[i]);
        i--;
      }
    }
    return mapCardElement;
  };

  window.card = {
    renderMapCard: renderMapCard
  };
})();
