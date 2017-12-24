'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var SUCCESS_STATUS = 200;
  var ERROR_MESSAGE = {
    400: 'Неверный запрос.',
    401: 'Пользователь не авторизован.',
    404: 'Ничего не найдено.',
    500: 'Ошибка сервера.'
  };
  var TIMEOUT = 30000;
  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        var error = ERROR_MESSAGE[xhr.status] ||
          'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
        onError(error);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения.');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });
    xhr.timeout = TIMEOUT;
    return xhr;
  };
  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    }
  };
})();
