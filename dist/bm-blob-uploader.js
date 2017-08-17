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
      throw new TypeError('blobUploader expects a api URL during instantiation');
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

    var vars = privateVars.get(this);
    if (!vars || !vars.hasOwnProperty('uri')) {
      return Promise.reject(new Error('blobUploader uri not configured'));
    }

    var request = new Request(vars.uri + 'v1/signedURL/', {
      method: 'POST',
      mode: 'cors'
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(new Error(response.status + ' ' + response.statusText));
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
      body: blob,
      headers: new Headers({
        'Content-Type': ' '
      })
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(Error(response.status + ' ' + response.statusText));
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

    var request = new Request(vars.uri + 'v1/signedURL/' + uuid, {
      method: 'PUT',
      mode: 'cors'
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(new Error(response.status + ' ' + response.statusText));
      }
      return response.json();
    }).then(function (apiResponse) {
      return apiResponse.getUrl;
    }).catch(function (err) {
      return Promise.reject(new Error('Error retrieving blob url: ' + err));
    });
  };

  blobUploader.prototype.managedUpload = function (blob /*: Blob */
  ) /* :Promise<number> */{
    if (!blob) {
      return Promise.reject(new Error('blob argument not provided'));
    }

    var vars = privateVars.get(this);
    if (!vars || !vars.hasOwnProperty('uri')) {
      return Promise.reject(new Error('blobUploader uri not configured'));
    }

    var request = new Request(vars.uri + 'v1/temporaryCredentials', {
      method: 'GET',
      mode: 'cors'
    });

    return fetch(request).then(function (response) {
      if (!response.ok) {
        return Promise.reject(new Error(response.status + ' ' + response.statusText));
      }
      return response.json();
    }).then(function (apiResponse) {
      return apiResponse.id; // TODO Implement call to S3
      // const AWS = require('aws-sdk')
      // const s3 = new AWS.S3({
      //   accessKeyId: apiResponse.credentials.AccessKeyId,
      //   secretAccessKey: apiResponse.credentials.SecretAccessKey,
      //   sessionToken: apiResponse.credentials.SessionToken,
      //   region: 'ap-southeast-2'
      // })
      // const params = {
      //   Bucket: apiResponse.bucket,
      //   Key: apiResponse.id,
      //   Body: blob
      // }
      // const managedUpload = s3.upload(params)
      // return managedUpload
      //   .promise()
      //   .then(apiResponse.id)
    }).catch(function (err) {
      return Promise.reject(new Error('Error calling blob api service: ' + err));
    });
  };

  module.exports = blobUploader;
});