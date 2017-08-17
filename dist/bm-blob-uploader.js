/*
* blob-uploader.js: v0.0.1 | https://github.com/blinkmobile/blob-uploader.js#readme
* (c) 2017 BlinkMobile | Released under the MIT license
*/

var blobUploader =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
      // const S3 = require('aws-sdk/clients/s3')
      // const s3 = new S3({
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDM3NDc1OWJlYTAyYTQzYjg1MzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jsb2ItdXBsb2FkZXIuanMiXSwibmFtZXMiOlsicHJpdmF0ZVZhcnMiLCJXZWFrTWFwIiwiYmxvYlVwbG9hZGVyIiwiYXBpVXJsIiwiVHlwZUVycm9yIiwic2V0IiwidXJpIiwicHJvdG90eXBlIiwidXBsb2FkQmxvYiIsImJsb2IiLCJQcm9taXNlIiwicmVqZWN0IiwiRXJyb3IiLCJ2YXJzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXF1ZXN0IiwiUmVxdWVzdCIsIm1ldGhvZCIsIm1vZGUiLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsIm9rIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsImpzb24iLCJhcGlSZXNwb25zZSIsIl91cGxvYWRUb1MzIiwicHV0VXJsIiwiaWQiLCJjYXRjaCIsImVyciIsInVybCIsImJvZHkiLCJoZWFkZXJzIiwiSGVhZGVycyIsInJldHJpZXZlQmxvYlVybCIsInV1aWQiLCJnZXRVcmwiLCJtYW5hZ2VkVXBsb2FkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNB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SkMsS0ExQkksQ0EwQkUsVUFBQ0MsR0FBRDtBQUFBLGFBQVN0QixRQUFRQyxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLHFDQUFxQ29CLEdBQS9DLENBQWYsQ0FBVDtBQUFBLEtBMUJGLENBQVA7QUEyQkQsR0E1Q0Q7O0FBOENBUyxTQUFPQyxPQUFQLEdBQWlCeEMsWUFBakIiLCJmaWxlIjoiYm0tYmxvYi11cGxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQzNzQ3NTliZWEwMmE0M2I4NTM0IiwiLy8gQGZsb3dcbid1c2Ugc3RyaWN0J1xuXG5jb25zdCBwcml2YXRlVmFycyA9IG5ldyBXZWFrTWFwKClcblxuZnVuY3Rpb24gYmxvYlVwbG9hZGVyIChhcGlVcmwgLyogOnN0cmluZyAqLykge1xuICBpZiAoIWFwaVVybCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Jsb2JVcGxvYWRlciBleHBlY3RzIGEgYXBpIFVSTCBkdXJpbmcgaW5zdGFudGlhdGlvbicpXG4gIH1cbiAgcHJpdmF0ZVZhcnMuc2V0KHRoaXMsIHtcbiAgICB1cmk6IGFwaVVybFxuICB9KVxufVxuXG5ibG9iVXBsb2FkZXIucHJvdG90eXBlLnVwbG9hZEJsb2IgPSBmdW5jdGlvbiAoXG4gIGJsb2IgLyo6IEJsb2IgKi9cbikgLyogOlByb21pc2U8bnVtYmVyPiAqLyB7XG4gIGlmICghYmxvYikge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2Jsb2IgYXJndW1lbnQgbm90IHByb3ZpZGVkJykpXG4gIH1cblxuICBjb25zdCB2YXJzID0gcHJpdmF0ZVZhcnMuZ2V0KHRoaXMpXG4gIGlmICghdmFycyB8fCAhdmFycy5oYXNPd25Qcm9wZXJ0eSgndXJpJykpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdibG9iVXBsb2FkZXIgdXJpIG5vdCBjb25maWd1cmVkJykpXG4gIH1cblxuICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodmFycy51cmkgKyAndjEvc2lnbmVkVVJMLycsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBtb2RlOiAnY29ycydcbiAgfSlcblxuICByZXR1cm4gZmV0Y2gocmVxdWVzdClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXMgKyAnICcgKyByZXNwb25zZS5zdGF0dXNUZXh0KSlcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICB9KVxuICAgIC50aGVuKChhcGlSZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5fdXBsb2FkVG9TMyhibG9iLCBhcGlSZXNwb25zZS5wdXRVcmwpXG4gICAgICByZXR1cm4gYXBpUmVzcG9uc2UuaWRcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0Vycm9yIGNhbGxpbmcgYmxvYiBhcGkgc2VydmljZTogJyArIGVycikpKVxufVxuXG5ibG9iVXBsb2FkZXIucHJvdG90eXBlLl91cGxvYWRUb1MzID0gZnVuY3Rpb24gKFxuICBibG9iIC8qIDpCbG9iICovLFxuICB1cmwgLyo6IHN0cmluZyAqL1xuKSAvKiA6UHJvbWlzZTx2b2lkPiAqLyB7XG4gIGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIHtcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIG1vZGU6ICdjb3JzJyxcbiAgICBib2R5OiBibG9iLFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnICdcbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiBmZXRjaChyZXF1ZXN0KVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoRXJyb3IocmVzcG9uc2Uuc3RhdHVzICsgJyAnICsgcmVzcG9uc2Uuc3RhdHVzVGV4dCkpXG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdFcnJvciB1cGxvYWRpbmcgdG8gUzM6ICcgKyBlcnIpKSlcbn1cblxuYmxvYlVwbG9hZGVyLnByb3RvdHlwZS5yZXRyaWV2ZUJsb2JVcmwgPSBmdW5jdGlvbiAoXG4gIHV1aWQgLyogOnN0cmluZyAqL1xuKSAvKiA6UHJvbWlzZTxzdHJpbmc+ICovIHtcbiAgaWYgKCF1dWlkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcigndXVpZCBhcmd1bWVudCBub3QgcHJvdmlkZWQnKSlcbiAgfVxuXG4gIGlmICghcHJpdmF0ZVZhcnMgfHwgIXByaXZhdGVWYXJzLmdldCh0aGlzKSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2Jsb2JVcGxvYWRlciB1cmkgbm90IGNvbmZpZ3VyZWQnKSlcbiAgfVxuICBjb25zdCB2YXJzID0gcHJpdmF0ZVZhcnMuZ2V0KHRoaXMpXG4gIGlmICghdmFycyB8fCAhdmFycy5oYXNPd25Qcm9wZXJ0eSgndXJpJykpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdibG9iVXBsb2FkZXIgdXJpIG5vdCBjb25maWd1cmVkJykpXG4gIH1cblxuICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodmFycy51cmkgKyAndjEvc2lnbmVkVVJMLycgKyB1dWlkLCB7XG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICBtb2RlOiAnY29ycydcbiAgfSlcblxuICByZXR1cm4gZmV0Y2gocmVxdWVzdClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXMgKyAnICcgKyByZXNwb25zZS5zdGF0dXNUZXh0KSlcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICB9KVxuICAgIC50aGVuKChhcGlSZXNwb25zZSkgPT4gYXBpUmVzcG9uc2UuZ2V0VXJsKVxuICAgIC5jYXRjaCgoZXJyKSA9PiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0Vycm9yIHJldHJpZXZpbmcgYmxvYiB1cmw6ICcgKyBlcnIpKSlcbn1cblxuYmxvYlVwbG9hZGVyLnByb3RvdHlwZS5tYW5hZ2VkVXBsb2FkID0gZnVuY3Rpb24gKFxuICBibG9iIC8qOiBCbG9iICovXG4pIC8qIDpQcm9taXNlPG51bWJlcj4gKi8ge1xuICBpZiAoIWJsb2IpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdibG9iIGFyZ3VtZW50IG5vdCBwcm92aWRlZCcpKVxuICB9XG5cbiAgY29uc3QgdmFycyA9IHByaXZhdGVWYXJzLmdldCh0aGlzKVxuICBpZiAoIXZhcnMgfHwgIXZhcnMuaGFzT3duUHJvcGVydHkoJ3VyaScpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignYmxvYlVwbG9hZGVyIHVyaSBub3QgY29uZmlndXJlZCcpKVxuICB9XG5cbiAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHZhcnMudXJpICsgJ3YxL3RlbXBvcmFyeUNyZWRlbnRpYWxzJywge1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgbW9kZTogJ2NvcnMnXG4gIH0pXG5cbiAgcmV0dXJuIGZldGNoKHJlcXVlc3QpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzICsgJyAnICsgcmVzcG9uc2Uuc3RhdHVzVGV4dCkpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgfSlcbiAgICAudGhlbigoYXBpUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiBhcGlSZXNwb25zZS5pZCAvLyBUT0RPIEltcGxlbWVudCBjYWxsIHRvIFMzXG4gICAgICAvLyBjb25zdCBTMyA9IHJlcXVpcmUoJ2F3cy1zZGsvY2xpZW50cy9zMycpXG4gICAgICAvLyBjb25zdCBzMyA9IG5ldyBTMyh7XG4gICAgICAvLyAgIGFjY2Vzc0tleUlkOiBhcGlSZXNwb25zZS5jcmVkZW50aWFscy5BY2Nlc3NLZXlJZCxcbiAgICAgIC8vICAgc2VjcmV0QWNjZXNzS2V5OiBhcGlSZXNwb25zZS5jcmVkZW50aWFscy5TZWNyZXRBY2Nlc3NLZXksXG4gICAgICAvLyAgIHNlc3Npb25Ub2tlbjogYXBpUmVzcG9uc2UuY3JlZGVudGlhbHMuU2Vzc2lvblRva2VuLFxuICAgICAgLy8gICByZWdpb246ICdhcC1zb3V0aGVhc3QtMidcbiAgICAgIC8vIH0pXG4gICAgICAvLyBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAvLyAgIEJ1Y2tldDogYXBpUmVzcG9uc2UuYnVja2V0LFxuICAgICAgLy8gICBLZXk6IGFwaVJlc3BvbnNlLmlkLFxuICAgICAgLy8gICBCb2R5OiBibG9iXG4gICAgICAvLyB9XG4gICAgICAvLyBjb25zdCBtYW5hZ2VkVXBsb2FkID0gczMudXBsb2FkKHBhcmFtcylcbiAgICAgIC8vIHJldHVybiBtYW5hZ2VkVXBsb2FkXG4gICAgICAvLyAgIC5wcm9taXNlKClcbiAgICAgIC8vICAgLnRoZW4oYXBpUmVzcG9uc2UuaWQpXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdFcnJvciBjYWxsaW5nIGJsb2IgYXBpIHNlcnZpY2U6ICcgKyBlcnIpKSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBibG9iVXBsb2FkZXJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9ibG9iLXVwbG9hZGVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==