'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var setStyle = function (element) {
    element.style.height = '150px';
    element.style.width = 'auto';
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
            var image = null;
            if (previewField.tagName.toLowerCase() !== 'img') {
              image = document.createElement('img');
              previewField.appendChild(image);
              setStyle(image);
            } else {
              image = previewField;
            }
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
