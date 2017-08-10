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
  // @flow
  'use strict';

  var privateVars = new WeakMap();

  function blobUploader(apiUrl /* :string */) {
    if (!apiUrl) {
      throw new TypeError('blobUploader expects a api URL during instansiation');
    }
    privateVars.set(this, {
      uri: apiUrl
    });
  }

  blobUploader.prototype.uploadBlob = function (blob /*: Blob */
  ) /* :Promise<number> */{
    var _this = this;

    if (!blob) {
      return Promise.reject(new Error('blob argument not provided'));
    }

    if (!privateVars || !privateVars.get(this)) {
      return Promise.reject(new Error('blobUploader uri not configured'));
    }
    var vars = privateVars.get(this);
    if (!vars || !vars.hasOwnProperty('uri')) {
      return Promise.reject(new Error('blobUploader uri not configured'));
    }

    var request = new Request(vars.uri, {
      method: 'POST',
      mode: 'cors'
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(new Error('Error calling blob api service: ' + response.status + ' ' + response.statusText));
      }
      return response.json();
    }).then(function (apiResponse) {
      _this._uploadToS3(blob, apiResponse.putUrl);
      return apiResponse.id;
    }).catch(function (err) {
      return Promise.reject(new Error('Error calling blob api service: ' + err));
    });
  };

  blobUploader.prototype._uploadToS3 = function (blob /* :Blob */
  , url /*: string */
  ) /* :Promise<void> */{
    var request = new Request(url, {
      method: 'PUT',
      mode: 'cors',
      body: blob
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(Error('Error uploading to S3: ' + response.status + ' ' + response.statusText));
      }
    }).catch(function (err) {
      return Promise.reject(new Error('Error uploading to S3: ' + err));
    });
  };

  blobUploader.prototype.retrieveBlobUrl = function (uuid /* :string */
  ) /* :Promise<string> */{
    if (!uuid) {
      return Promise.reject(new Error('uuid argument not provided'));
    }

    if (!privateVars || !privateVars.get(this)) {
      return Promise.reject(new Error('blobUploader uri not configured'));
    }
    var vars = privateVars.get(this);
    if (!vars || !vars.hasOwnProperty('uri')) {
      return Promise.reject(new Error('blobUploader uri not configured'));
    }

    var request = new Request(vars.uri + uuid, {
      method: 'PUT',
      mode: 'cors'
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(new Error('Error calling blob api service: ' + response.status + ' ' + response.statusText));
      }
      return response.json();
    }).then(function (apiResponse) {
      return apiResponse.getUrl;
    }).catch(function (err) {
      return Promise.reject(new Error('Error calling blob api service: ' + err));
    });
  };

  module.exports = blobUploader;
});