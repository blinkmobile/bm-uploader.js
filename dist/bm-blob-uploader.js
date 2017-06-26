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

    var request = new Request(privateVars.get(this).uri, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return new Error('Error calling blob api service: ' + response.status + ' ' + response.statusText);
      }
      return response.json();
    }).then(function (apiResponse) {
      _this._uploadToS3(blob, apiResponse.putUrl);
      return apiResponse.id;
    }).catch(function (err) {
      return new Error('Error calling blob api service: ', err);
    });
  };

  blobUploader.prototype._uploadToS3 = function (blob, url) {
    var request = new Request(url, {
      method: 'PUT',
      mode: 'cors-with-forced-preflight',
      redirect: 'follow',
      body: blob,
      headers: new Headers({
        'Content-Type': ' '
      })
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return new Error('Error uploading to S3: ' + response.status + ' ' + response.statusText);
      }
    }).catch(function (err) {
      return new Error('Error uploading to S3: ', err);
    });
  };

  module.exports = blobUploader;
});