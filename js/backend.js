'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 30000;
  var ErrorMessage = {
    '400': 'Неверный запрос.',
    '401': 'Пользователь не авторизован.',
    '404': 'Ничего не найдено.',
    '500': 'Ошибка сервера.'
  };
  var setup = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        return successHandler(xhr.response);
      }
      var error = ErrorMessage[xhr.status] ||
        'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      return errorHandler(error);
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения.');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });
    xhr.timeout = TIMEOUT;
    return xhr;
  };
  window.backend = {
    save: function (data, loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    load: function (loadHandler, errorHandler) {
      var xhr = setup(loadHandler, errorHandler);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    }
  };
})();
