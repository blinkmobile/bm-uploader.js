/*
 * blob-uploader.js: v0.0.1 | https://github.com/blinkmobile/blob-uploader.js#readme
 * (c) 2017 BlinkMobile | Released under the MIT license
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.blobUploader = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var privateVars = new WeakMap();

  function blobUploader(apiUrl) {
    if (!apiUrl) {
      throw new TypeError('blobUploader expects a api URL during instansiation');
    }
    privateVars.set(this, {
      uri: apiUrl
    });
  }

  blobUploader.prototype.uploadBlob = function (blob) {
    var _this = this;

    if (!blob) {
      return Promise.reject(new Error('blob argument not passed in'));
    }

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', privateVars.get(_this).uri, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            // success response
            // now upload the file to S3 using the returned url
            var obj = JSON.parse(xhr.responseText);
            return this._uploadToS3(blob, obj.putUrl).then(function () {
              resolve(obj.id);
            }).catch(reject);
          } else {
            return reject(new Error('Error calling blob upload service ' + xhr.status + ' message: ' + xhr.responseText));
          }
        }
      };
      xhr.send();
    });
  };

  blobUploader.prototype._uploadToS3 = function (blob, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error('Error uploading file: ' + xhr.status + ' message: ' + xhr.responseText));
          }
        }
      };
      xhr.setRequestHeader('Content-type', ' '); // suppress Content-type header
      xhr.send(blob);
    });
  };

  module.exports = blobUploader;
});