'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var createImg = function (parentElement) {
    var image = document.createElement('img');

    image.style.height = '150px';
    image.style.width = 'auto';
    parentElement.appendChild(image);
    return image;
  };

  var showPreview = function (fileChooser, previewField) {
    var inputFileChangeHandler = function () {
      Array.prototype.forEach.call(fileChooser.files, function (file) {
        var fileName = file.name.toLowerCase();

        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();
          var fileLoadHandler = function () {
            var image = previewField.tagName === 'IMG' ? previewField : createImg(previewField);
            image.src = reader.result;
          };

          reader.addEventListener('load', fileLoadHandler);
          reader.readAsDataURL(file);
        }
      });
    };

    fileChooser.addEventListener('change', inputFileChangeHandler);
  };

  var clearPreview = function (previewField) {
    var images = previewField.querySelectorAll('img');
    Array.prototype.forEach.call(images, function (image) {
      previewField.removeChild(image);
    });
  };

  showPreview(window.element.avatarFileChooser, window.element.avatarPreview);
  showPreview(window.element.photoFileChooser, window.element.photoPreview);
  window.preview = {
    clear: clearPreview
  };
})();
